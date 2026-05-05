import {BaseRepository} from "./baseRepository.js"

class companyRepository extends BaseRepository {
  constructor() {
    super("public.companies");
  }

    /*
  async findByEmail(email){

    const [rows] = await this.query('SELECT * FROM public.users WHERE email=$1', [email]);
    return rows[0]
    
  } 
  */
}

export default new companyRepository();