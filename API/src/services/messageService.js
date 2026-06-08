// messageService.js

import messageRepository from "../repositories/messageRepository.js"
import statisticRepository from "../repositories/statisticRepository.js"
import { pool } from "../db.js";
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador, averageComplexity } from "../utils/analizer.js"
import { validateFields, blockFields } from "../utils/validationUtils.js";

class messageService {

    async getUsedAiPorcentages(data){
        validateFields(["companyId"], data)

        const Ais = await messageRepository.getUsedAIs(data.companyId);
        
        let geminiCount=0, chatgptCount=0, claudeCount=0, otherCount=0

        for(let i=0; i<Ais.length; i++){
            if(Ais[i].platform?.includes("gemini")){
                geminiCount++
            }else if(Ais[i].platform?.includes("chatgpt")){
                chatgptCount++
            }else if(Ais[i].platform?.includes("claude")){
                claudeCount++
            }else{
                otherCount++
            }
        }

        return {
            gemini: (Math.floor(((geminiCount * 100)/Ais.length)*100))/100+"%",
            chatgpt: (Math.floor(((chatgptCount * 100)/Ais.length)*100))/100+"%",
            claude: (Math.floor(((claudeCount * 100)/Ais.length)*100))/100+"%",
            other: (Math.floor(((otherCount * 100)/Ais.length)*100))/100+"%"
        }
    }

    async getActivityVolume(data) {
        validateFields(["companyId"], data)
        const rows = await messageRepository.getActivityVolumeByCompany(data.companyId, data.period)
        return rows
    }

    async getPlatformAdoption(data) {
        validateFields(["companyId"], data)
        const rows = await messageRepository.getPlatformAdoptionByCompany(data.companyId)
        return rows
    }

    async getHourlyDistribution(data) {
        validateFields(["companyId"], data)
        const rows = await messageRepository.getHourlyDistributionByCompany(data.companyId)
        return rows
    }

    async getAvgQueryComplexity(data) {
        validateFields(["companyId"], data)
        const row = await messageRepository.getAvgQueryComplexityByCompany(data.companyId)
        return row
    }

    async getInteractionRate(data) {
        validateFields(["companyId"], data)
        const row = await messageRepository.getInteractionRateByCompany(data.companyId)
        return row
    }

    async uploadMessage(data) {
        console.log("=== [BACKEND SERVICIO] Objeto 'data' recibido ===");
        console.log(data);
        
        validateFields(['user_id', 'content', 'sender', 'platform'], data)
        blockFields(['creation_datetime'], data)

        const allowedEmisors = ["user", "chatgpt", "gemini", "claude", "copilot", "other"];
        if (!allowedEmisors.includes(data.sender)) {
            throw new Error("Invalid emisor");
        }

        setPrompt(data.content)
        const cantTokens = tokenize(data.content, data.platform)

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
            
            console.log("=== [BACKEND SERVICIO] Pasando 'data' a BaseRepository ===");
            console.log(data);

            const message = await messageRepository.create(data, client)
            
            console.log("=== [BACKEND SERVICIO] Respuesta de messageRepository.create ===");
            console.log(message);

            objectStatistics.message_id=message.id
            
            await statisticRepository.create(objectStatistics, client)

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