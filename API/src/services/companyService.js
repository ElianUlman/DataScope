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

            return newCompany;

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

export default new companyService();
