import messageRepository from "../repositories/messageRepository.js"

class messageService {
    async uploadMessage(data) {
        const requiredFields = ['user_id', 'content', 'sender'];

        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`${field} is required`);
            }
        }

        const allowedEmisors = ["user", "chatgpt", "gemini", "claude", "copilot", "other"];
        if (!allowedEmisors.includes(data.sender)) {
            throw new Error("Invalid emisor");
        }

        const message = await messageRepository.create(data)
        return message
    }


}


export default new messageService()

/**export const uploadMessage = async (req,res)=>{
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
} */