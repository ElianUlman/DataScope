import {BaseRepository} from "./baseRepository.js"

class messageRepository extends BaseRepository {
  constructor() {
    super("public.messages");
  }

    /*
  async findByEmail(email){

    const [rows] = await this.query('SELECT * FROM public.users WHERE email=$1', [email]);
    return rows[0]
    
  } 
  */
}

export default new messageRepository();