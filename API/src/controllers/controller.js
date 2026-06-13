export const initialPage = async (req, res) => {

    res.send("funciono");
};

import { tokenize } from "../utils/nlpService.js";

export const func4tests = async (req,res) =>{
    const result= await tokenize("hola, conta mis tokens", "gemini")
    res.send(result)
}