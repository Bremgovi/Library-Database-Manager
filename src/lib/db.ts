import {Pool} from 'pg';

let db: any;

if(!db){
    db = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'prueba1',
        password: 'its',
        port: 5432,
    });
}
export {db};
