

export function onlyIntParam(req, res, next){
    const {id}=req.params;
    if (!Number.isInteger(Number(id))) return res.status(400).send("invalid ID")
    next();
}