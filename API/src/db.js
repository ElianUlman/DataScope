import pg from 'pg';
import 'dotenv/config';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


//esto es para bucket storage (para guardar imagenes, como la foto de perfil, en la DB)
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);





//funcion para cuando estamos en el colegio con la configuraciones de conexion para su db
/*
export const pool=new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "DataScope",
    port: 5432
})
*/
/*
export const pool=new pg.Pool({
    user: "dbToAPI_user",
    host: "localhost",
    password: "simplepassword",
    database: "dataScopeDb",
    port: "5432"
})
*/

 








//colegio:
//user: postgres
//password: root


//re-create a backup (4 school)
//"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost
///q
//"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d DataScope -f "C:\Users\49257442\Desktop\DataScope\API\src\database\dataScopeDbMay6Backup.sql"

//contra supabase: supabase datascope autobus reverendo messi