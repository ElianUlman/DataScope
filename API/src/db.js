import pg from 'pg';

//funcion para cuando estamos en el colegio con la configuraciones de conexion para su db
/*
export const pool=new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "DataScope",
    port: "5432"
})
*/

//funcion para la casa de luca, con el usuario local dbToAPI_user
/**/
export const pool=new pg.Pool({
    user: "dbToAPI_user",
    host: "localhost",
    password: "simplepassword",
    database: "placeholderDataScopeDb",
    port: "5432"
})




//colegio:
//user: postgres
//password: root