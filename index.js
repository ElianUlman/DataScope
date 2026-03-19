//needed to start exectuion (configuration)
// npm i express (installa el node_modules y todo lo que necesita para correr)
// npm i nodemon -D (la -D significa que es una dependencia de desarrollo)
// *extension*: REST client

//to run: npm run dev |OR| node index.js


import express from "express";
import fs from "fs";

const app = express();


const readData=()=>{
    try{
      const Data= fs.readFileSync("./placeholderDB.json");
        return JSON.parse(Data);  
    }catch (error){
        console.log("PEDAZO DE PELOTUDO")
    }
};

const writeDate=(data)=>{
    try{
        fs.writeFileSync("./placeholderDB.json", JSON.stringify(Data))
    }catch (error){
        console.log("TA BANNEADO, PERMABANNEADO, QUE TE ARREGLEN BIEN EL ANO")
    }
}

app.get("/", (req, res) => {
    res.send("ME CORRO... me corri");
});

app.listen(3000, ()=>{

    console.log("ME CORRO ME CORRO... me corri");
    
})