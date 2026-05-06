import inviteRepository from "../repositories/inviteRepository.js";
import userRepository from "../repositories/userRepository.js";

class inviteService {
  async getInvitesByCompanyId(data){
    if(!data.id){throw new Error("id missing")}
    return await inviteRepository.getInvitesByCompanyId(data.id)
  }

  async createInvite(data){
    if(!data.targetUserMail){throw new Error("missing target user email")}
    if(!data.companyId){throw new Error("missing company id")}

    const targetUser = await userRepository.findByEmail(data.targetUserMail)

    return await inviteRepository.create({"companyfk": data.companyId, "userfk": targetUser.id, "isadmin": false, "isvalid": true})
  }

  async isAdminOfCompany(data){
    if(!data.companyId){throw new Error("company id missing")}
    if(!data.id){throw new Error("id missing")}

    return await inviteRepository.isAdminOfCompany(data.id, data.companyId)

  }
}

export default new inviteService();


