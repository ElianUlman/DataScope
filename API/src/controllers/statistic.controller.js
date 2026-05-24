//import statisticService from "../services/statisticService.js";
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador, averageComplexity } from "../utils/analizer.js"

export const saveStats = async (req,res)=>{
    setPrompt(req.body.content)
    getWords()
    tokenize()
    const complexity = calcularComplejidad()
    console.log("complejidad average: "+averageComplexity())
    await initClasificador();
    const {categoria: category} = await clasificate();
    console.log("category but again :D "+category)
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