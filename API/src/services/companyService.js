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


        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`${field} is required`);
            }
        }

        try{
            client.query('BEGIN')
            const newCompany = await companyRepository.create({"name": data.companyName, "tier": data.companyTier},client).rows[0]
            const userCreator = await userRepository.getById(data.userId, client)
            await inviteRepository.create({},client)
            client.query('COMMIT')
        }catch{
            client.query('ROLLBACK')
            throw new Error('something went wrong')
        }
        
    }


}

export default companyService
/*


export const createCompany = async (req, res) => {
    const client = await pool.connect();
    try{
        

        const {companyName, companyTier, username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, hashRounds);
        //esto es como si fuera un SP
        await client.query('BEGIN');
        v const companyReturn = await client.query('INSERT INTO public.companies(name, tier) VALUES ($1, $2) RETURNING *', [companyName, companyTier])
        
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