import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST REQUEST FOR UPDATE ANY TABLE
export async function POST(req: Request){
    try{
        const body = await req.json();
        const { table, data, condition } = body;

        if (!table || !data || !condition) {
            return NextResponse.json(
                { message: "Table name, data, and condition are required!" },
                { status: 400 }
            );
        }

        const columns = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(data);
        const conditionColumns = Object.keys(condition).map((key, index) => `${key} = $${values.length + index + 1}`).join(' AND ');
        const conditionValues = Object.values(condition);

        const updateQuery = `UPDATE ${table} SET ${columns} WHERE ${conditionColumns} RETURNING *`;
        const result = await db.query(updateQuery, [...values, ...conditionValues]);

        if (!result.rows.length) {
            return NextResponse.json(
                { message: "Failed to update data in the table!" },
                { status: 500 }
            );
        }

        const updatedData = result.rows[0];

        return NextResponse.json(
            { data: updatedData, message: "Data updated successfully!" },
            { status: 200 }
        );

    } catch(e) {
        console.error("Error updating data: ", e);
        return NextResponse.json(
            { message: "Something went wrong!" },
            { status: 500 }
        );
    }
}
