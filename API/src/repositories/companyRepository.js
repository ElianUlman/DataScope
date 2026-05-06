import BaseRepository from "./baseRepository.js"


class companyRepository extends BaseRepository {
  
  constructor() {
    super("public.companies");
  }

  async getCompaniesByAdmin(id){
    const {rows: companies} = await this.query(`SELECT public.companies.name 
        FROM public.invites INNER JOIN public.companies ON public.companies.id = public.invites.companyfk
        WHERE public.invites.userfk=$1 AND public.invites.isadmin=TRUE AND public.invites.isvalid=TRUE`, [id])
    
    return companies
  }

  async getCompaniesByUserId(id){
    const {rows: companies} = await this.query(`SELECT public.companies.name 
        FROM public.invites INNER JOIN public.companies ON public.companies.id = public.invites.companyfk
        WHERE public.invites.userfk=$1 AND public.invites.isvalid=TRUE`, [id])
    
    return companies
  }

  async findByName(name){

    const {rows} = await this.query('SELECT * FROM public.companies WHERE name=$1', [name]);
    return rows[0]
    
  } 
 
}


export default new companyRepository();