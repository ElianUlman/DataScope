import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

import userService from "../services/userService.js"

export const createUser = async (req, res) =>{
    try{

        const {name, password, email} = req.body
        const hashedPassword = await bcrypt.hash(password, hashRounds);
        await pool.query('INSERT INTO public.users(name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword])
        
    }catch(error){
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



export const getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const createUser2 = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};