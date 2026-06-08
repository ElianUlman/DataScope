import messageService from "../services/messageService.js";

export const uploadMessage = async(req,res)=>{
    try{
        const user_id = req.user.id
        const {content, sender, platform} = req.body
        const message = await messageService.uploadMessage({ content, sender, user_id, platform})
        if(message){res.status(201).send("message uploaded succesfully")}
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}

export const AIsPorcentageByCompany = async(req,res) =>{
    try{
        const companyId = req.targetCompanyId
        const result = await messageService.getUsedAiPorcentages({companyId})
        res.status(201).json(result)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}

export const getActivityVolume = async(req, res) => {
    try {
        const companyId = req.targetCompanyId
        const { period } = req.query
        const result = await messageService.getActivityVolume({ companyId, period })
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const getPlatformAdoption = async(req, res) => {
    try {
        const companyId = req.targetCompanyId
        const result = await messageService.getPlatformAdoption({ companyId })
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const getHourlyDistribution = async(req, res) => {
    try {
        const companyId = req.targetCompanyId
        const result = await messageService.getHourlyDistribution({ companyId })
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const getAvgQueryComplexity = async(req, res) => {
    try {
        const companyId = req.targetCompanyId
        const result = await messageService.getAvgQueryComplexity({ companyId })
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const getInteractionRate = async(req, res) => {
    try {
        const companyId = req.targetCompanyId
        const result = await messageService.getInteractionRate({ companyId })
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json({ error: "error ocurred" })
    }
}