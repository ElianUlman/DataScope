
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador, averageComplexity } from "../utils/analizer.js"

export const initialPage = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    console.log("hasta aca me interesa la wea")

    setPrompt(req.body.content)
    getWords()
    tokenize()
    const complexity = calcularComplejidad()
    console.log("complejidad average: "+averageComplexity())
    await initClasificador();
    const {categoria: category} = await clasificate();
    console.log("category but again :D "+category)
    
    

    //clasificate()
    res.send("funciono");
};
