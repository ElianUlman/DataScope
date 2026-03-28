import jwt from "jsonwebtoken";
import {tokenPassword} from "../config.js"

export function onlyIntParam(req, res, next){
    const {id}=req.params;
    if (!Number.isInteger(Number(id))) return res.status(400).send("invalid ID")
    next();
}


export const authentication = (req, res, next) => {
    const token = req.headers.authorization;;

    if(!token) return res.status(401).send("not logged")

    try{
        const user = jwt.verify(token, tokenPassword);
        req.user = user
        next()
    }catch(error){
        res.send("encountered "+error)
    }
}