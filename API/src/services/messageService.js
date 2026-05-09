import messageRepository from "../repositories/messageRepository.js"
import { pool } from "../db.js";
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador, averageComplexity } from "../utils/analizer.js"

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


        
        await initClasificador();
        const clasificador = await clasificate();

        //latencia_ms = ~cuánto tarda la API en responder --> esto hace falta conseguir creo
        //costo estimado = ~tokens usados × precio del modelo --> se puede hacer con un enum, pero por facilidad
        //voy a usar un precio del modelo promedio y fijo

        //analizer.js no analiza ni claridad, ni "clarity examples" ni "clarity costraints" (asi que voy a igualarlos a 1 y despues los hacemos)
        
        setPrompt(data.content)
        const cantTokens = tokenize()
        const complexity = averageComplexity()

        await initClasificador();
        const {categoria: category} = await clasificate();

        const client = await pool.connect();
        try{
            await client.query('BEGIN')
            const message = await messageRepository.create(data) //need to use the id



            await client.query('COMMIT')
            return message

        } catch (error) {

            await client.query('ROLLBACK')
            throw new Error(error)

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