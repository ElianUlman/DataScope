

import messageService from "../services/messageService.js";

export const uploadMessage = async(req,res)=>{
    try{
        const user_id = req.user.id
        const {content, emisor} = req.body
        const message = await messageService.uploadMessage({ content, emisor, user_id})
        if(message){res.status(201).send("message uploaded succesfully")}
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}

/*
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
    */