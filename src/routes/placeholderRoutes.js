import {Router} from "express";
import {pool} from "../db.js";

const routes = Router();

routes.get('/pruebaRoutes', (req, res) =>{
    res.send("FUNCIONO MUAUASJAUSUANUZOGJARHNWIORSNI JLDNCHUGVSHRXNGORZOMUIHNLS");
})

routes.get('/prueba/:num', (req, res) => {
    const {num}=req.params;
    res.send("tu vieja se traga "+num+" porongas");
})

routes.get('/companies', async (req, res)=>{
    const {rows} = await pool.query('SELECT * FROM public.company');
    res.send(rows);
})

export default routes;