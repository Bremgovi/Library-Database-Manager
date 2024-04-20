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

  } catch (e) {
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
    if (!table) {
      return NextResponse.json(
        { message: "Table name is required!" },
        { status: 400 }
      );
    }

    let query = `SELECT * FROM ${table}`;
    const result = await db.query(query);

    if (!result.rows.length) {
      return NextResponse.json(
        { message: "No data found for the specified condition!" },
        { status: 404 }
      );
    }
    
    const data = result.rows;
    return NextResponse.json(
      { data, message: "Data retrieved successfully!" },
      { status: 200 }
    );

  } catch (e) {
    console.error("Error processing request: ", e);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
