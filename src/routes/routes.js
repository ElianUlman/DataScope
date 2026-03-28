import {Router} from "express";
//import {pool} from "../db.js";
//import fs, { read } from "fs";

import {
    initialPage, /*
    getCompanies, 
    getAreas, 
    getCompanyById, 
    getAreaById,
    getCompanyByName,
    getAreaByName,
    insertCompany, */
    login,
    getCompanyByToken
} from "../controllers/controller.js"

import {
    authentication, 
    onlyIntParam
} from "../middleware/middleware.js"

const routes = Router();

//GETs
routes.get("/", initialPage);

/*
routes.get('/companies', getCompanies)
routes.get('/areas', getAreas)

//with params
routes.get('/companies/:id', onlyIntParam, getCompanyById)
routes.get('/areas/:id', onlyIntParam, getAreaById)

//POSTs
routes.post('/company/name', getCompanyByName)
routes.post('/areas/name', getAreaByName)



//PUTS
routes.put('/company', insertCompany)
*/

routes.post('/login', login)
routes.get('/comapnyToken', authentication, getCompanyByToken)


export default routes;













// routes.get("/usuarios", (req, res)=>{
//     res.send(JSON.stringify(readData()))
// })


// routes.get('/prueba/:num', (req, res) => {
//     const {num}=req.params;
//     res.send("tu vieja se traga "+num+" porongas");
// })


// const readData=()=>{
//     try{
//       const data= fs.readFileSync("placeholderDB.json");
//         return JSON.parse(data);  
//     }catch (error){
//         console.log("error")
//     }
// };
// const writeData=(data)=>{
//     try{
//         fs.writeFileSync("placeholderDB.json", JSON.stringify(data))
//     }catch (error){
//         console.log("error")
//     }
// }