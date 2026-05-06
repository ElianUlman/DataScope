import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

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

export const getCompanyData = async (req,res)=>{
    const user =req.user
    const {rows: companiesWithUser} = await pool.query(`SELECT public.companies.name
        FROM public.companies INNER JOIN public.invites ON public.companies.id = public.invites.companyfk
        INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.users.id = $1`, [user.id])
    res.json(companiesWithUser)
}