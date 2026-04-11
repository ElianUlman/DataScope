import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

export const initialPage = (req, res) => {
    res.send("funciono");
};

export const createInvite = async (req, res) =>{
    try{
        const user = req.user
        const {companyName, targetUserMail} = req.body //company name is unique
        const {rows: [{ id: companyId }]} = await pool.query(`SELECT id FROM public.companies WHERE name=$1`, [companyName])
        
        const { rows: [{isadmin: isAdmin}] } = await pool.query('SELECT public.invites.isadmin FROM public.invites INNER JOIN public.companies ON public.companies.id=public.invites.companyfk INNER JOIN public.users ON public.users.id=public.invites.userfk WHERE public.companies.id=$1 AND public.users.id=$2', [companyId ,user.id])
        
        if(!isAdmin){res.status(403).send({error: "you do not have admin access"})}
        
        const {rows: [{ id: targetUserId}]} = await pool.query(`SELECT id FROM public.users WHERE email=$1`, [targetUserMail])
        
        await pool.query(`INSERT INTO public.invites(
	        companyfk, userfk, isadmin, isvalid)
	        VALUES ($1, $2, CAST(0 AS BIT), CAST(1 AS BIT));`, [companyId, targetUserId])

        res.send()

    }catch(error){
        res.send(error)
    }
}

export const createUser = async (req, res) =>{
    try{

        const {name, password, email} = req.body
        const hashedPassword = await bcrypt.hash(password, hashRounds);
        await pool.query('INSERT INTO public.users(name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword])
        
    }catch(error){
        res.send(error)
    }
}

export const createCompany = async (req, res) => {
    const client = await pool.connect();
    try{
        

        const {companyName, companyTier, username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, hashRounds);
        //esto es como si fuera un SP
        await client.query('BEGIN');
        const companyReturn = await client.query('INSERT INTO public.companies(name, tier) VALUES ($1, $2) RETURNING *', [companyName, companyTier])
        
        const userReturn = await client.query('INSERT INTO public.users(name, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword])
        
        await client.query('INSERT INTO public.invites(companyfk, userfk, isadmin, isvalid) VALUES ($1, $2, CAST(1 AS BIT), CAST(1 AS BIT))', [companyReturn.rows[0].id, userReturn.rows[0].id])

        await client.query('COMMIT');
        res.json("")
    }catch(error){
        await client.query('ROLLBACK');

        res.send(error)
    }
}

export const loginUser = async (req, res) =>{
    const {email, password} = req.body

    try{
        const queryResult = await pool.query('SELECT * FROM public.users WHERE email=$1', [email]);
        if(queryResult.rowCount === 0) return res.status(401).json({ error: "user does not exist" })
        
        const userData = queryResult.rows[0]

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if(!passwordMatch) return res.status(401).json({error: "wrong password"})

        const token = jwt.sign(
            { id: userData.id, username: userData.name},
            tokenWholePassword,
            { expiresIn: "1h" }
        );

        

        res.json({token})
        
    }catch(error){
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

export const getUserData = async (req, res) => {
    const user = req.user
    const company = await pool.query('SELECT * FROM public.users WHERE id=$1', [user.id]);
    res.json(company.rows[0]);
}

/*
export const insertCompany = async (req, res)=>{
    
    const {name, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, hashRounds);

    const {rows} = await pool.query('INSERT INTO public.company (name, password) VALUES ($1, $2) RETURNING *', [name, hashedPassword])
    res.json(rows[0])
}


export const loginCompany = async (req, res)=>{
    const {companyName, companyPassword} = req.body
    try{
        const companyQueryResult = await pool.query('SELECT * FROM public.company WHERE name=$1', [companyName]);
        if(companyQueryResult.rowCount === 0) return res.status(401).json({ error: "company doesnt exist" })
        
        const company = companyQueryResult.rows[0]

        const matchCompany = await bcrypt.compare(companyPassword, company.password);

        if(!matchCompany) return res.status(401).json({error: "wrong password"})

        const token = jwt.sign(
            { companyId: company.id, companyName: company.name},
            tokenCompanyPassword,
            { expiresIn: "1h" }
        );

        res.json({token})
        
    }catch(error){
        res.status(500).json({ error: error.message || "Internal server error" })
    }
}

export const loginAreaByCompany = async (req, res)=>{ 
    const user = req.user
    const {areaName, areaPassword} = req.body

    try{
       
        const areaQueryResult = await pool.query('SELECT * FROM public."operationalAreas" WHERE name=$1 AND "companyId"=$2', [areaName, user.companyId]);
        if(areaQueryResult.rowCount === 0) return res.status(401).json({ error: "area doesnt exist" })
        
        const area = areaQueryResult.rows[0]

        const matchArea = await bcrypt.compare(areaPassword, area.password);

        if(!matchArea) return res.status(401).json({error: "wrong password"})

        const token = jwt.sign(
            { companyId: user.companyId, companyName: user.companyName, areaId: area.id, areaName: area.name },
            tokenWholePassword,
            { expiresIn: "1h" }
        );

        res.json({token})
        
    }catch(error){
        res.send("encountered "+error)
    }
}



// export const companySignUp = async (req, res)=>{
//     const {name, password}=req.body
//     const hashedPassword = await bcrypt.hash(password, hashRounds);

//     const {rows} = await pool.query('INSERT INTO public.company (name, password) VALUES ($1, $2) RETURNING *', [name, hashedPassword])
//     res.json(rows[0])
// }

// export const areaSignUpByCompany = async (req, res) => {
//     const {companyName, companyPassword, areaName, areaPassword} = req.body
// }



export const getCompanyByToken = async (req, res) => {
    const user = req.user
    const company = await pool.query('SELECT * FROM public.company WHERE id=$1', [user.companyId]);
    res.json(company.rows[0]);
}

export const getAllByToken = async (req, res) => {
    const user = req.user
    const company = await pool.query('SELECT * FROM public.company WHERE id=$1', [user.companyId]);
    const area = await pool.query('SELECT * FROM public."operationalAreas" WHERE id=$1', [user.areaId]);
    res.json({
    company: company.rows[0],
    area: area.rows[0]
});
}
*/