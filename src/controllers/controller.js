import {Router} from "express";
import {pool} from "../db.js";

export const initialPage = (req, res) => {
    res.send("funciono");
};

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