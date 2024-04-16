import {Pool} from 'pg';

let db: any;

if(!db){
    db = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'biblioteca',
        password: 'its',
        port: 5432,
    });
}
if (db){console.log("DB connected") }

export {db};
