import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { table, data, condition, deleteCondition } = body;
    if (!table) {
      return NextResponse.json(
        { message: "Table name is required!" },
        { status: 400 }
      );
    }

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

    } else if (data && condition) {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
      const values = Object.values(data);

      const conditionColumns = Object.keys(condition).map((key, index) => `${key} = $${values.length + index + 1}`).join(' AND ');
      const conditionValues = Object.values(condition);
      
      const query = `UPDATE ${table} SET (${columns}) = (${placeholders}) WHERE ${conditionColumns} RETURNING *`;
      values.push(...conditionValues);

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

    } else if (deleteCondition) {
      const conditionColumns = Object.keys(deleteCondition).map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      const conditionValues = Object.values(deleteCondition);
      
      const query = `DELETE FROM ${table} WHERE ${conditionColumns} RETURNING *`;

      const result = await db.query(query, conditionValues);

      if (!result.rows.length) {
        return NextResponse.json(
          { message: "Failed to delete data from the table!" },
          { status: 500 }
        );
      }

      const deletedData = result.rows[0];

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

  } catch (e:any) {

    if (e.code === '23503') { // Postgres error code for foreign key violation
      return NextResponse.json(
        { message: "Cannot delete the record because it's being used in another table!",
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
    const searchParams = new URL(req.url).searchParams;
    const table = searchParams.get('table');
    const tableSchema = searchParams.get('tableSchema');

    if (!table && !tableSchema) {
      return NextResponse.json({ message: 'Table name or table schema is required!' });
    }

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
        type: row.type.includes('character') ? 'varchar' : row.type.includes('integer') ? 'int' : row.type,
        length: row.length,
      }));

      return NextResponse.json({ columns, message: 'Table schema retrieved successfully!' });
    }

    const dataQuery = `SELECT * FROM ${table}`;
    const dataResult = await db.query(dataQuery);

    if (!dataResult.rows.length) {
      return NextResponse.json({ message: 'No data found for the specified table!' });
    }

    return NextResponse.json({ data: dataResult.rows, message: 'Data retrieved successfully!' });

  } catch (error) {
    console.error('Error processing request: ', error);
    return NextResponse.json({ message: 'Something went wrong!' });
  }
}
