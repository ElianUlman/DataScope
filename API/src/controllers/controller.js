import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

export const initialPage = (req, res) => {
    res.send("funciono");
};

export const getAdminsCompanies = async (req,res)=>{
    try{
        const {rows: companies} = await pool.query(`SELECT public.companies.name 
        FROM public.invites INNER JOIN public.companies ON public.companies.id = public.invites.companyfk
        INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.users.id=$1 AND public.invites.isadmin=CAST(1 AS BIT)`, [req.user.id])

        res.json(companies)
    }catch(error){
        res.send(error)
    }
}

export const getInvites = async (req,res)=>{
    try{
        const companyId= req.targetCompanyId

        const {rows: invites} = await pool.query(`SELECT public.users.name, public.users.email, public.invites.isadmin, public.invites.creationdate, public.invites.isvalid
	    FROM public.invites INNER JOIN public.companies ON public.companies.id = public.invites.companyfk
        INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.companies.id=$1`, [companyId])

            res.json(invites)

    }catch(error){
        res.send(error)
    }
}

export const createInvite = async (req, res) =>{
    try{
        
        const {targetUserMail} = req.body
        const companyId= req.targetCompanyId
        
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

export const getCompanyData = async (req,res)=>{
    const user =req.user
    const {rows: companiesWithUser} = await pool.query(`SELECT public.companies.name
        FROM public.companies INNER JOIN public.invites ON public.companies.id = public.invites.companyfk
        INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.users.id = $1`, [user.id])
    res.json(companiesWithUser)
}


export const uploadMessage = async (req,res)=>{
    const user=req.user
    
    try{
        const answer = await pool.query(`INSERT INTO public.messages(
	    user_id, content, sender)
	    VALUES ($1, $2, $3)
        `, [user.id, req.body.message, req.body.sender])
        res.json("")
        
    }catch(error){

        if(req.body.sender != ("user", "chatgpt", "gemini", "claude", "copilot", "other")) res.send("invalid sender"); return
        res.send(error)
    }
}