import BaseRepository from "./baseRepository.js"


class companyRepository extends BaseRepository {
  constructor() {
    super("public.companies");
  }

  async getCompaniesByAdmin(id){
    const {rows: companies} = await this.query(`SELECT public.companies.name 
        FROM public.invites INNER JOIN public.companies ON public.companies.id = public.invites.companyfk
        WHERE public.invites.userfk=$1 AND public.invites.isadmin=CAST(1 AS BIT)`, [id])
    
    return companies
  }


 
}


export default new companyRepository();