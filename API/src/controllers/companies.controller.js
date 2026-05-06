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
        const {companyName, companyTier} = req.body
        const userId = req.user.id
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

