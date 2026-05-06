import BaseRepository from "./baseRepository.js"

class messageRepository extends BaseRepository {
  constructor() {
    super("public.messages");
  }

   
}

export default new messageRepository();