
import BaseRepository from "./baseRepository.js"

class userRepository extends BaseRepository {
  constructor() {
    super("public.users");
  }

  async findByEmail(email){

    const {rows} = await this.query('SELECT * FROM public.users WHERE email=$1', [email]);
    return rows[0]
    
  } 

}

export default new userRepository();

