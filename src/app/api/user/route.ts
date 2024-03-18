import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

// POST REQUEST FOR USER CREATION
export async function POST(req: Request){
    try{
        const body = await req.json();
        const {username, password} = body;

        //Check if username and password are valid
        const existingUsername = await db.user.findUnique({
            where: {username: username}
        });
        
        if(existingUsername){
            return NextResponse.json(
                {user: null, message: "User already exists with this username!"},
                {status: 409}
            );
        }


        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data:{
                username,
                password: hashedPassword
            }
        });

        const {password: newUserPassword, ...rest} = newUser;


        return NextResponse.json({user: rest, message: "User created successfully!"}, {status: 201});
    }catch(e){
        return NextResponse.json({message: "Something went wrong!"}, {status: 500});
    }
}