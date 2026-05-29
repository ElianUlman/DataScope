import statisticService from "../services/statisticService.js";

export const getStatsByUser = async (req,res)=>{
    try{
        const data={};
        data.id = req.user.id
        const response = await statisticService.getAllByUser(data)
        res.status(200).json(response)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error"})
    }
}

export const getUserAvg = async (req,res)=>{
    try{
        const data={};
        data.id = req.user.id
        const response = await statisticService.getStatAvg(data)
        res.status(200).json(response)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error"})
    }
}

/**import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador } from "../utils/analizer.js"

export const initialPage = async (req, res) => {
    console.log("Contenido recibido:", req.body.content);
    setPrompt(req.body.content)
    getWords()
    tokenize()
    const complejidad = calcularComplejidad()
    await initClasificador();
    const clasificador = await clasificate();

    //clasificate()
    res.send("funciono");
};
 */