import BaseRepository from "./baseRepository.js"

class statisticRepository extends BaseRepository {
  constructor() {
    super("public.statistics");
  }

  async getByUserId(id){
      const {rows: statistics} = await this.query(`SELECT *
      FROM public.statistics INNER JOIN public.messages ON public.statistics.message_id = public.messages.id
      INNER JOIN public.users ON public.users.id = public.messages.user_id
      WHERE public.users.id = $1
      `, [id])
      
    return statistics
  }

  async getAvgByUser(id){
    const {rows} = await this.query(`SELECT users.name, AVG(used_tokens) as used_tokens_AVG,
      AVG(latency_ms) as latency_ms_AVG,
      AVG(estimated_cost) as estimated_cost_AVG, 
      AVG(clarity) as clarity_AVG,
      AVG(complexity) as complexity_AVG,
      AVG(clarity_examples) as clarity_examples_AVG,
      AVG(clarity_constraints) as clarity_constraints_AVG
      FROM public.statistics INNER JOIN public.messages ON public.statistics.message_id = public.messages.id
      INNER JOIN public.users ON public.users.id = public.messages.user_id
      WHERE public.users.id = $1
      GROUP BY users.name
      `, [id])
    return rows[0]
  }

   
}

export default new statisticRepository();