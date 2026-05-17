import companyRepository from "../repositories/companyRepository.js"
import userRepository from "../repositories/userRepository.js"
import inviteRepository from "../repositories/inviteRepository.js";
import { pool } from "../db.js";

import { validateFields } from "../utils/validationUtils.js";

class companyService {

    async getCompaniesByAdminId(data) {
        validateFields(['id'], data)

        return companyRepository.getCompaniesByAdmin(data.id)
    }

    async createCompany(data) {

        validateFields(['companyName', 'companyTier', 'userId'], data)

        const allowedTiers = ["basic", "standard", "advanced"];
        if (!allowedTiers.includes(data.companyTier)) {
            throw new Error("Invalid company tier");
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN')

            

            const existing = await companyRepository.findByName(data.companyName);
            if (existing) { throw new Error("Company already exists") }

            const newCompany = await companyRepository.create({ "name": data.companyName, "tier": data.companyTier }, client)

            const userCreator = await userRepository.getById(data.userId, client)
            if (!userCreator) { throw new Error("user not found") }

            await inviteRepository.create({ "companyfk": newCompany.id, "userfk": userCreator.id, "isadmin": true, "isvalid": true }, client)
            await client.query('COMMIT')

            return newCompany;

        } catch (error) {

            await client.query('ROLLBACK')
            throw new Error(error.message)

        } finally {
            client.release();
        }

    }

    async getCompaniesByUserId(data) {
        validateFields(['id'], data)
        return await companyRepository.getCompaniesByUserId(data.id)
    }


}

export default new companyService();
