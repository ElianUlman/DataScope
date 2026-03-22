import {Router} from "express";
const routes = Router();

routes.get('/pruebaRoutes', (req, res) =>{
    res.send("FUNCIONO MUAUASJAUSUANUZOGJARHNWIORSNI JLDNCHUGVSHRXNGORZOMUIHNLS");
})

routes.get('/prueba/:num', (req, res) => {
    const {num}=req.params;
    res.send("tu vieja se traga "+num+" porongas");
})

export default routes;