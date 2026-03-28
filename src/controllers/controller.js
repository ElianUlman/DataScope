import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenPassword} from "../config.js"
import jwt from "jsonwebtoken";

export const initialPage = (req, res) => {
    res.send("funciono");
};


/*


export const getCompanies = async (req, res)=>{
    const {rows} = await pool.query('SELECT * FROM public.company');
    res.json(rows);
}



export const getAreas= async (req, res)=>{
    const {rows} = await pool.query('SELECT * FROM public."operationalAreas"');
    res.json(rows);
}



export const getCompanyById = async (req, res)=>{
    const {id}=req.params;

    const {rows, rowCount} = await pool.query('SELECT * FROM public.company WHERE id=$1', [id]);
    if (rowCount === 0) return res.status(404).send("ID does not exist")

    res.json(rows[0]);
}



export const getAreaById = async (req, res)=>{
    const {id}=req.params;

    const {rows, rowCount} = await pool.query('SELECT * FROM public."operationalAreas" WHERE id=$1', [id]);
    if (rowCount === 0) return res.status(404).send("ID does not exist")

    res.json(rows[0]);
}



export const getCompanyByName = async (req, res)=>{
    const {name}=req.body;

    const {rows, rowCount} = await pool.query('SELECT * FROM public.company WHERE name=$1', [name]);
    if (rowCount === 0) return res.status(404).send("company does not exist")

    res.json(rows[0]);
}



export const getAreaByName = async (req, res)=>{
    const {name}=req.body;

    const {rows, rowCount} = await pool.query('SELECT * FROM public."operationalAreas" WHERE name=$1', [name]);
    if (rowCount === 0) return res.status(404).send("area does not exist")

    res.json(rows[0]);
}



export const insertCompany = async (req, res)=>{
    const {name, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, hashRounds);

    const {rows} = await pool.query('INSERT INTO public.company (name, password) VALUES ($1, $2) RETURNING *', [name, hashedPassword])
    res.json(rows[0])
}
*/

export const login = async (req, res)=>{
    const {companyName, companyPassword, areaName, areaPassword} = req.body
    try{
        const companyQueryResult = await pool.query('SELECT * FROM public.company WHERE name=$1', [companyName]);
        if(companyQueryResult.rowCount === 0) return res.status(401).json({ error: "company doesnt exist" })

        const areaQueryResult = await pool.query('SELECT * FROM public."operationalAreas" WHERE name=$1 AND "companyId"=$2', [areaName, companyQueryResult.rows[0].id]);
        if(areaQueryResult.rowCount === 0) return res.status(401).json({ error: "area doesnt exist" })
        
        const company = companyQueryResult.rows[0]
        const area = areaQueryResult.rows[0]

        const matchCompany = await bcrypt.compare(companyPassword, company.password);
        const matchArea = await bcrypt.compare(areaPassword, area.password);

        if(!matchCompany) return res.status(401).json({error: "wrong company password"})
        if(!matchArea) return res.status(401).json({error: "wrong area password"})

        const token = jwt.sign(
            { companyId: company.id, companyName: company.name, areaId: area.id, areaName: area.name },
            tokenPassword,
            { expiresIn: "1h" }
        );

        res.json({token})
        
    }catch(error){
        res.send("encountered "+error)
    }
}



export const getCompanyByToken = async (req, res) => {
    const user = req.user
    const company = await pool.query('SELECT * FROM public.company WHERE id=$1', [user.companyId]);
    const area = await pool.query('SELECT * FROM public."operationalAreas" WHERE id=$1', [user.areaId]);
    res.json({
    company: company.rows[0],
    area: area.rows[0]
});
}