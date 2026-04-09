// npm i (installs all dependencies)
// *extension*: REST client (for using tester.http)
//to run: npm run dev |OR| node index.js


import express from "express";
import cors from "cors";
import {PORT} from "./config.js";
import routesPrueba from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routesPrueba);


app.listen(3000, ()=>{

    console.log("api corriendo en localhost:"+PORT);
    
})