import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

//delete later. logic goes to company repo/service

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
