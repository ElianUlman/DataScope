
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador } from "../utils/analizer.js"

export const initialPage = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    console.log("hasta aca me interesa la wea")

    setPrompt(req.body.message)
    getWords()
    tokenize()
    const complejidad = calcularComplejidad()
    await initClasificador();
    const clasificador = await clasificate();

    //clasificate()
    res.send("funciono");
};
