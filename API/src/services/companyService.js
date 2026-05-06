import companyRepository from "../repositories/companyRepository.js"
import userRepository from "../repositories/userRepository.js"
import inviteRepository from "../repositories/inviteRepository.js";
import {pool} from "../db.js";

class companyService {

    async getCompaniesByAdmin (data){
        if(!data.id){throw new Error("id needed")}

        return companyRepository.getCompaniesByAdmin(data.id)
    }

    async createCompany (data){
        const requiredFields = ['companyName', 'companyTier', 'userId'];
        const client = await pool.connect();

        try{
            for (const field of requiredFields) {
                if (!data[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            await client.query('BEGIN')
            const newCompany = await companyRepository.create({"name": data.companyName, "tier": data.companyTier},client)

            const userCreator = await userRepository.getById(data.userId, client)
            if(!userCreator){throw new Error("user not found")}

            await inviteRepository.create({"companyfk": newCompany.id, "userfk": userCreator.id, "isadmin": true, "isvalid": true},client)
            await client.query('COMMIT')
            
        }catch(error){

            await client.query('ROLLBACK')
            throw new Error(error)

        }finally {
        client.release();
        }
        
    }

    async getCompaniesByUserId(data){
        if(!data.id){throw new Error("id needed")}
        return await companyRepository.getCompaniesByUserId(data.id)
    }


}

export default companyService
/*


export const getCompanyData = async (req,res)=>{
    const user =req.user
    const {rows: companiesWithUser} = await pool.query(`SELECT public.companies.name
        FROM public.companies INNER JOIN public.invites ON public.companies.id = public.invites.companyfk
        INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.users.id = $1`, [user.id])
    res.json(companiesWithUser)
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
*/