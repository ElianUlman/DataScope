
import { setPrompt, getWords, tokenize, calcularComplejidad, clasificate, initClasificador } from "../utils/analizer.js"

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
