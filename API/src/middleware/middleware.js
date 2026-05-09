import jwt from "jsonwebtoken";
import {tokenWholePassword} from "../config.js"
import {pool} from "../db.js";

import inviteService from "../services/inviteService.js";

export function onlyIntParam(req, res, next){
    const {id}=req.params;
    if (!Number.isInteger(Number(id))) return res.status(400).send("invalid ID")
    next();
}


export const authentication = (req, res, next) => {
    

    const token = req.headers.authorization;;

    if(!token) return res.status(401).send("not logged")

    try{
        const user = jwt.verify(token, tokenWholePassword);
        req.user = user
        
        next()
    }catch(error){
        res.send("encountered "+error)
    }
}

//probablemente haya que rehacer esta func
export const adminAuth = async (req, res, next) =>{
    
    if(!req.user){return res.status(401).send("no login data")}

    try{
        const {companyId} = req.body
        const id = req.user.id

        const isAdmin = await inviteService.isAdminOfCompany({companyId, id})

        if(isAdmin == 0){return res.status(403).send({error: "you do not have admin access"})}

        req.targetCompanyId = companyId

        next()

    }catch(error){
        res.status(400).send("encountered "+error)
    }
    
}


