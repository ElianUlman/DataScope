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
    getCompanyByToken,
    loginCompany,
    loginAreaByCompany,
    getAllByToken
} from "../controllers/controller.js"

import {
    authentication, 
    onlyCompanyAuth, 
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

routes.post('/loginCompany', loginCompany)
routes.post('/loginArea', onlyCompanyAuth, loginAreaByCompany)

routes.get('/companyToken', onlyCompanyAuth, getCompanyByToken)
routes.get('/allToken', authentication, getAllByToken)


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