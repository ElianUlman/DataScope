import {Router} from "express";
//import {pool} from "../db.js";
//import fs, { read } from "fs";

import {
    initialPage, 
    createCompany,
    loginUser,
    getUserData,
    createUser
    /*
    insertCompany, 
    getCompanyByToken,
    loginCompany,
    loginAreaByCompany,
    getAllByToken*/
} from "../controllers/controller.js"

import {
    authentication, 
    onlyCompanyAuth, 
    onlyIntParam
} from "../middleware/middleware.js"

const routes = Router();

//GETs
routes.get("/", initialPage);

routes.get('/userdata', authentication, getUserData)

//PUTS
routes.put('/createCompany', createCompany)
routes.put('/createUser', createUser)

//POSTS
routes.post('/login', loginUser)

/*
//PUTS
routes.put('/company', insertCompany)

//POSTS
routes.post('/loginCompany', loginCompany)
routes.post('/loginArea', onlyCompanyAuth, loginAreaByCompany)

routes.get('/companyToken', onlyCompanyAuth, getCompanyByToken)
routes.get('/allToken', authentication, getAllByToken)
*/

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