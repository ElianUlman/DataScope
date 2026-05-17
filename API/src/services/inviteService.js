import inviteRepository from "../repositories/inviteRepository.js";
import userRepository from "../repositories/userRepository.js";

import { validateFields } from "../utils/validationUtils.js";

class inviteService {
  async getInvitesByCompanyId(data){
    
    validateFields(['id'], data)

    return await inviteRepository.getInvitesByCompanyId(data.id)
  }

  async createInvite(data){
   
    validateFields(['companyId', 'targetUserMail'], data)
    blockFields(['creationdate'], data)

    const targetUser = await userRepository.findByEmail(data.targetUserMail)
    const existing = await inviteRepository.getInvite(targetUser.id, data.companyId)
    if(existing){throw new Error("invite already exists")}

    return await inviteRepository.create({"companyfk": data.companyId, "userfk": targetUser.id, "isadmin": false, "isvalid": true})
  }

  async isAdminOfCompany(data){
    
    validateFields(['id', 'companyId'], data)

    const invite = await inviteRepository.getInvite(data.id, data.companyId)
    if(!invite){return false}

    return invite.isadmin

  }
}

export default new inviteService();


