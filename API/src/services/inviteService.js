import inviteRepository from "../repositories/inviteRepository.js";
import userRepository from "../repositories/userRepository.js";

class inviteService {
  async getInvitesByCompanyId(data){
    if(!data.id){throw new Error("id missing")}
    return await inviteRepository.getInvitesByCompanyId(data.id)
  }

  async createInvite(data){
    if(!data.targetUserMail){throw new Error("missing targetUserMail")}
    if(!data.companyId){throw new Error("missing companyId")}

    const targetUser = await userRepository.findByEmail(data.targetUserMail)
    const existing = await inviteRepository.getInvite(targetUser.id, data.companyId)
    if(existing){throw new Error("invite already exists")}

    return await inviteRepository.create({"companyfk": data.companyId, "userfk": targetUser.id, "isadmin": false, "isvalid": true})
  }

  async isAdminOfCompany(data){
    if(!data.companyId){throw new Error("company id missing")}
    if(!data.id){throw new Error("id missing")}
    const invite = await inviteRepository.getInvite(data.id, data.companyId)
    if(!invite){return false}

    return invite.isadmin

  }
}

export default new inviteService();


