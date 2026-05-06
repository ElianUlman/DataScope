import BaseRepository from "./baseRepository.js"

class inviteRepository extends BaseRepository {
  constructor() {
    super("public.invites");
  }

  async getInvitesByCompanyId(id){
    const {rows} = await this.query(`SELECT public.users.name, public.users.email, public.invites.isadmin, public.invites.creationdate, public.invites.isvalid
        FROM public.invites INNER JOIN public.users ON public.users.id = public.invites.userfk
        WHERE public.invites.companyfk=$1`, [id])
    return rows
  }

  async isAdminOfCompany(id, companyId){
    const {rows: [{isadmin: isAdmin}]} = await this.query(`SELECT public.invites.isadmin FROM public.invites
        WHERE public.invites.companyfk=$1 AND public.invites.userfk=$2`, [companyId , id])
    return isAdmin
  }
}


export default new inviteRepository();