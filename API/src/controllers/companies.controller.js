import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

import companyService from "../services/companyService.js";

export const getCompaniesByAdminId = async (req,res)=>{
    try{
        const id = req.user.id
        const companies = await companyService.getCompaniesByAdminId({id})
        res.status(200).json(companies)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error"})
    }
}

export const createCompany = async (req, res) => {
    try{
        const {companyName, companyTier, userId} = req.body
        const newCompany = await companyService.createCompany({companyName, companyTier, userId})
        res.status(201).json(newCompany)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error"})
    }
}

export const getCompanyData = async (req,res)=>{
    try{
        const id = req.user.id
        const company = await companyService.getCompaniesByUserId({id})
        res.status(200).json(company)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error"})
    }
}

