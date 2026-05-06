import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

//old original controller

export const initialPage = (req, res) => {
    res.send("funciono");
};





export const uploadMessage = async (req,res)=>{
    const user=req.user
    
    try{
        const answer = await pool.query(`INSERT INTO public.messages(
	    user_id, content, sender)
	    VALUES ($1, $2, $3)
        `, [user.id, req.body.message, req.body.sender])
        res.json("")
        
    }catch(error){

        if(req.body.sender != ("user", "chatgpt", "gemini", "claude", "copilot", "other")) res.send("invalid sender"); return
        res.send(error)
    }
}