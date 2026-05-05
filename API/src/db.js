import pg from 'pg';

//funcion para cuando estamos en el colegio con la configuraciones de conexion para su db

export const pool=new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "DataScope",
    port: "5432"
})

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
//"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d DataScope -f "C:\Users\49008593\Desktop\DataScope\API\src\database\newBackup.sql"