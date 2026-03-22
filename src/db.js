import pg from 'pg';

export const pool=new pg.Pool({
    user: "dbToAPI_user",
    host: "localhost",
    password: "simplepassword",
    database: "placeholderDataScopeDb",
    port: "5432"
})

//en esta parte probablemente haya que cambiar cosas cuando corra en el colegio