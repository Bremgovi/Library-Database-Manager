import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
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
        const selectQuery= 'SELECT * FROM usuarios WHERE usuario = $1';

        const values = [username];
        const existingUsername = await db.query(selectQuery, values);
        if(existingUsername.rows.length > 0){
            return NextResponse.json(
                {user: null, message: "User already exists with this username!"},
                {status: 409} 
            );
        }
        const insertQuery = 'INSERT INTO usuarios (usuario, contrasena, id_tipo) VALUES ($1, $2, $3)';
        const hashedPassword = await hash(password, 10);
        const insertValues = [username, hashedPassword, 1];
        const newUser = await db.query(insertQuery, insertValues);
        const {password: newUserPassword, ...rest} = newUser;
        return NextResponse.json({user: rest, message: "User created successfully!"}, {status: 201});
    }catch(e){
        console.error("Error creating user: ", e);
        return NextResponse.json({message: "Something went wrong!" + e}, {status: 500});
    }
}


 // GET REQUEST FOR USER TYPE
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const type = await db.query('SELECT tu.descripcion FROM usuarios u JOIN tipos_usuario tu ON u.id_tipo = tu.id_tipo WHERE u.usuario = $1', [username]);
  const employeeId = await db.query('SELECT empleados.id_empleado FROM empleados JOIN usuarios ON empleados.id_usuario = usuarios.id_usuario WHERE usuarios.usuario = $1', [username]);
  if (type.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({type: type.rows[0].descripcion, employeeId: employeeId.rows[0]}, {status: 200});
}