import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

/* API TO MAKE TABLE OPERATIONS SUCH AS: INSERT, DELETE, UPDATE*/
export async function POST(req: Request) {
  try {
    /* GET DATA */
    const body = await req.json();
    const { table, data, condition, deleteCondition, idColumns, radioColumn } = body;
    /* VALIDATIONS */
    if (!table && !radioColumn) {
      return NextResponse.json(
        { message: "Table name is required!" },
        { status: 400 }
      );
    }

    if (radioColumn){
      const { foreignTable, idColumn, descriptionColumn } = radioColumn;
      const query = `SELECT ${idColumn}, ${descriptionColumn} FROM ${foreignTable}`;
      const result = await db.query(query);
      if (!result.rows.length) {
        return NextResponse.json({ message: 'No data found for the specified table!' });
      }
      return NextResponse.json({ data: result.rows, message: 'Data retrieved successfully!' });
    }

    /* GET DATA FROM ID COLUMNS */
    if(idColumns){
      let idColumnsArray = [];
      let idColumnsName = "";
      let foreignTableName = "";
      const allRows = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}';`);
      let allColumns = allRows.rows.map((row: { column_name: any; }) => row.column_name); 
      for (const column of idColumns) {
        const {foreignTable, idColumn, columns} = column
        const columnsArray = columns.map((column: string) => column.trim());
        idColumnsArray.push({foreignTable, idColumn, columns: columnsArray});
        
        const index = allColumns.indexOf(column.idColumn);
        allColumns.splice(index, 1);
      }
      allColumns = allColumns.map((column: string) => `${table}.${column}`);
      let firstColumn = allColumns;
      allColumns = firstColumn.splice(1)
      firstColumn = firstColumn.join(', ');
      allColumns = allColumns.join(', ');
      const concatExpressions = idColumnsArray.map(({ foreignTable, idColumn, columns }) => {
        const prefixedColumns = `CONCAT_WS(' ', ${columns.map((column: string) => `${foreignTable}.${column}`).join(', ')})`;
        idColumnsName = columns.map((column: string) => `${foreignTable}.${column}`).join(', ');
        foreignTableName = foreignTable;
        return `CONCAT(${table}.${idColumn}, ' ', ${prefixedColumns}) as ${idColumn}`;
      }).join(', ');

      const joinConditions = idColumnsArray.map(({ foreignTable, idColumn }) => {
          return `LEFT JOIN ${foreignTable} ON ${table}.${idColumn} = ${foreignTable}.${idColumn}`;
      }).join(' ');
      
      const dataQuery = `
      SELECT 
          ${firstColumn},
          ${concatExpressions},
          ${allColumns}
      FROM ${table}
      ${joinConditions};
      `;
      console.log(dataQuery);
      
      const idColumnsQuery = `SELECT ${idColumnsName} from ${foreignTableName}`;
      const idColumnsResult = await db.query(idColumnsQuery);
      
      const dataResult = await db.query(dataQuery);
      if (!dataResult.rows.length) {
        return NextResponse.json({ message: 'No data found for the specified table!' });
      }else{
        return NextResponse.json({ idData: idColumnsResult.rows, data: dataResult.rows, message: 'Data retrieved successfully!' });
      } 
    }

    /* MANAGE USER PASSWORD */
    if (table === 'usuarios' && data) {
      const { usuario: username, contrasena: password } = data;
      if (!username || !password) {
        return NextResponse.json(
          { message: "Username and password cannot be empty!" },
          { status: 400 }
        );
      }
      const hashedPassword = await hash(password, 10);
      data.contrasena = hashedPassword;
    }
    
    /* INSERT DATA*/
    if (data && !condition) {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
      const values = Object.values(data);

      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;

      const result = await db.query(query, values);

      if (!result.rows.length) {
        return NextResponse.json(
          { message: "Failed to insert data into the table!" },
          { status: 500 }
        );
      }

      const insertedData = result.rows[0];

      return NextResponse.json(
        { data: insertedData, message: "Data inserted successfully!" },
        { status: 200 }
      );
    } 
    /* UPDATE DATA*/
    else if (data && condition) {
      const columns = Object.keys(data).join(', '); 
      const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
      const values = Object.values(data);

      const conditionColumns = Object.keys(condition).map((key, index) => `${key} = $${values.length + index + 1}`).join(' AND ');
      const conditionValues = Object.values(condition);
      
      const query = `UPDATE ${table} SET (${columns}) = (${placeholders}) WHERE ${conditionColumns} RETURNING *`;
      values.push(...conditionValues);
      
      console.log(query)
      console.log(values)
      const result = await db.query(query, values);

      if (!result.rows.length) {
        return NextResponse.json(
          { message: "Failed to modify data in the table!" },
          { status: 500 }
        );
      }

      const modifiedData = result.rows[0];

      return NextResponse.json(
        { data: modifiedData, message: "Data modified successfully!" },
        { status: 200 }
      );
    } 

    /* DELETE DATA*/
    else if (deleteCondition) {
      const conditionColumns = Object.keys(deleteCondition).map((key, index) => {
        const values = deleteCondition[key];
        const placeholders = values.map((_:any, idx:any) => `$${index * values.length + idx + 1}`).join(', ');
        return `${key} IN (${placeholders})`;
      }).join(' OR ');
      const conditionValues = Object.values(deleteCondition).flat();
      const query = `DELETE FROM ${table} WHERE ${conditionColumns} RETURNING *`;
      console.log(query); 
      const result = await db.query(query, conditionValues);

      if (!result.rows.length) {
        return NextResponse.json(
          { message: "Failed to delete data from the table!" },
          { status: 500 }
        );
      }

      const deletedData = result.rows;

      return NextResponse.json(
        { data: deletedData, message: "Data deleted successfully!" },
        { status: 200 }
      );

    } else {
      return NextResponse.json(
        { message: "Invalid request!" },
        { status: 400 }
      );
    }
  
  /* EXCEPTION HANDLING */
  } catch (e:any) {
    if (e.message.includes('violates foreign key constraint')) { 
      return NextResponse.json(
        { 
          message: "Cannot delete the record because it's being used in another table!",
          title: "Foreign key violation!"
        },
        { status: 400 }
      );
    }
  
    console.error("Error processing request: ", e);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    /* OBTAIN URL VALUES */
    const searchParams = new URL(req.url).searchParams;
    const table = searchParams.get('table');
    const tableSchema = searchParams.get('tableSchema');
    
    /* VALIDATIONS */
    if (!table && !tableSchema) {
      return NextResponse.json({ message: 'Table name or table schema is required!' });
    }

    /* OBTAIN TABLE SCHEMA */
    if (tableSchema) {
      const schemaQuery = `
        SELECT column_name AS key,
               column_name AS label,
               data_type AS type,
               character_maximum_length AS length
        FROM information_schema.columns
        WHERE table_name = $1
        AND table_schema = 'public';
      `;

      const schemaResult = await db.query(schemaQuery, [tableSchema]);

      if (!schemaResult.rows.length) {
        return NextResponse.json({ message: 'No schema found for the specified table!' });
      }

      const columns = schemaResult.rows.map((row: { key: any; label: any; type: string | string[]; length: any; }) => ({
        key: row.key,
        label: row.label,
        type: row.type.includes('character') ? 'varchar' : row.type.includes('integer') || row.type.includes('numeric') ? 'int' : row.type,
        length: row.length,
      }));

      return NextResponse.json({ columns, message: 'Table schema retrieved successfully!' });
    }

    /* OBTAIN TABLE ROWS */
    if (table) {
      const dataQuery = `SELECT * FROM ${table}`;
      const dataResult = await db.query(dataQuery);
      if (!dataResult.rows.length) {
        return NextResponse.json({ message: 'No data found for the specified table!' });
      }else{
        return NextResponse.json({ data: dataResult.rows, message: 'Data retrieved successfully!' });
      }
    }

  /* EXCEPTION HANDLING */
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong! Error: ' + error});
  }
} 
