import BaseRepository from "./baseRepository.js"

class statisticRepository extends BaseRepository {
  constructor() {
    super("public.statistics");
  }

   
}

export default new statisticRepository();