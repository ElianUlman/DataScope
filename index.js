//needed to start exectuion (configuration)
// npm i express (installa el node_modules y todo lo que necesita para correr)
//npm i cors (installa cors, para conectar con extension)

// npm i nodemon -D (la -D significa que es una dependencia de desarrollo)
// *extension*: REST client

//to run: npm run dev |OR| node index.js


import express from "express";
import cors from "cors";
import fs, { read } from "fs";

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

app.listen(3000, ()=>{

    console.log("api corriendo");
    
})