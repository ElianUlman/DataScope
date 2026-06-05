export const initialPage = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    console.log("hasta aca me interesa la wea")

    res.send("funciono");
};

import { tokenize } from "../utils/analizer.js";

export const func4tests = async (req,res) =>{
    const result= await tokenize("hola, conta mis tokens", "gemini")
    res.send(result)
}