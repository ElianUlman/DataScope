export const initialPage = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    console.log("hasta aca me interesa la wea")

    res.send("funciono");
};

import redis from "../utils/redis.js";

import { sendEmail } from "../utils/mailer.js";

export const test = async (req, res) => {

    await redis.set("test", "hola");
    console.log(await redis.get("test"));
    sendEmail("emailtestmfa@gmail.com", 123)
    res.send("e")
}