//needed to start exectuion (configuration)
// npm i (installs all dependencies)

// *extension*: REST client

//to run: npm run dev |OR| node index.js


import express from "express";
import cors from "cors";
import fs, { read } from "fs";
import {PORT} from "./config.js";
import routesPrueba from './routes/placeholderRoutes.js';

const app = express();
app.use(cors());

const readData=()=>{
    try{
      const data= fs.readFileSync("./placeholderDB.json");
        return JSON.parse(data);  
    }catch (error){
        console.log("error")
    }
};

const writeData=(data)=>{
    try{
        fs.writeFileSync("./placeholderDB.json", JSON.stringify(data))
    }catch (error){
        console.log("error")
    }
}

app.get("/", (req, res) => {
    res.send("funciono");
});

app.get("/usuarios", (req, res)=>{
    res.send(JSON.stringify(readData()))
})

app.use(routesPrueba);

app.listen(PORT, ()=>{

    console.log("api corriendo en localhost:"+PORT);
    
})