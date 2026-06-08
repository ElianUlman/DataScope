import BaseRepository from "./baseRepository.js"

class messageRepository extends BaseRepository {
  constructor() {
    super("public.messages");
  }

  async getUsedAIs(id){
    const {rows} = await this.query(`SELECT public.messages.platform 
      FROM public.messages INNER JOIN public.users ON public.users.id = public.messages.user_id
      INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE companyfk=$1`, [id])
    return rows
  }
   
}

export default new messageRepository();