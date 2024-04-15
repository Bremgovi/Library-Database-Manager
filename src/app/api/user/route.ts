import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import {db} from "../../../lib/db";

// POST REQUEST FOR USER CREATION
export async function POST(req: Request){
    try{
        const body = await req.json();
        const {username, password} = body;
        if(!username || !password){
            return NextResponse.json(
                {user: null, message: "Username and password cannot be empty!"},
                {status: 400}
            );
        }
        //Check if username and password are valid
        const selectQuery= 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const existingUsername = await db.query(selectQuery, values);

        if(existingUsername.rows.length > 0){
            return NextResponse.json(
                {user: null, message: "User already exists with this username!"},
                {status: 409} 
            );
        }
        const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        const hashedPassword = await hash(password, 10);
        const insertValues = [username, hashedPassword];
        const newUser = await db.query(insertQuery, insertValues);
        const {password: newUserPassword, ...rest} = newUser;
        return NextResponse.json({user: rest, message: "User created successfully!"}, {status: 201});
    }catch(e){
        return NextResponse.json({message: "Something went wrong!" + e}, {status: 500});
    }
}