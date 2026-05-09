

import messageService from "../services/messageService.js";

export const uploadMessage = async(req,res)=>{
    try{
        console.log("en controller")
        const user_id = req.user.id
        const {content, sender} = req.body
        const message = await messageService.uploadMessage({ content, sender, user_id})
        if(message){res.status(201).send("message uploaded succesfully")}
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}
