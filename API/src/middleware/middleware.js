import jwt from "jsonwebtoken";
import {tokenCompanyPassword, tokenWholePassword} from "../config.js"
import {pool} from "../db.js";

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

export const adminAuth = async (req, res, next) =>{
    const user = req.user
    if(!user){return res.status(401).send("no login data")}

    try{
        
        const {companyName} = req.body //company name is unique
        const {rows: [{ id: companyId }]} = await pool.query(`SELECT id FROM public.companies WHERE name=$1`, [companyName])
        
        const { rows: [{isadmin: isAdmin}] } = await pool.query(`SELECT public.invites.isadmin FROM public.invites 
            INNER JOIN public.companies ON public.companies.id=public.invites.companyfk 
            INNER JOIN public.users ON public.users.id=public.invites.userfk 
            WHERE public.companies.id=$1 AND public.users.id=$2`, [companyId ,user.id])
        
        if(isAdmin == 0){return res.status(403).send({error: "you do not have admin access"})}

        req.targetCompanyId = companyId

        next()

    }catch(error){
        res.send("encountered "+error)
    }
    
}

export const onlyCompanyAuth = (req, res, next) => {
    const token = req.headers.authorization;;

    if(!token) return res.status(401).send("not logged")

    try{
        const user = jwt.verify(token, tokenCompanyPassword);
        req.user = user
        next()
    }catch(error){
        res.send("encountered "+error)
    }
}