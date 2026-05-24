import messageRepository from "../repositories/messageRepository.js"
import statisticRepository from "../repositories/statisticRepository.js"
import { pool } from "../db.js";
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador, averageComplexity } from "../utils/analizer.js"

import { validateFields, blockFields } from "../utils/validationUtils.js";

class messageService {
    
    async uploadMessage(data) {
        
        validateFields(['user_id', 'content', 'sender'], data)
        blockFields(['creation_datetime'], data)
        

        const allowedEmisors = ["user", "chatgpt", "gemini", "claude", "copilot", "other"];
        if (!allowedEmisors.includes(data.sender)) {
            throw new Error("Invalid emisor");
        }


        

        //latencia_ms = ~cuánto tarda la API en responder --> esto hace falta conseguir creo
        //costo estimado = ~tokens usados × precio del modelo --> se puede hacer con un enum, pero por facilidad voy a usar un precio del modelo promedio y fijo

        //analizer.js no analiza ni claridad, ni "clarity examples" ni "clarity costraints" (asi que voy a igualarlos a 1 y despues los hacemos)
        
        setPrompt(data.content)
        const cantTokens = tokenize()

        await initClasificador();
        const {categoria: category} = await clasificate();

        const objectStatistics={
            message_id: 0,
            used_tokens: cantTokens,
            latency_ms: 1,
            estimated_cost: (cantTokens*0.0000001),
            category: category,
            clarity: 1,
            complexity: await averageComplexity(),
            clarity_examples: 1,
            clarity_constraints: 1
        }

        const client = await pool.connect();
        try{
            await client.query('BEGIN')
            const message = await messageRepository.create(data, client) //need to use the id
            objectStatistics.message_id=message.id
            
            const statistic = await statisticRepository.create(objectStatistics, client)
            

            await client.query('COMMIT')
            return message

        } catch (error) {

            await client.query('ROLLBACK')
            throw new Error(error.message)

        } finally {
            client.release();
        }
        

        
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