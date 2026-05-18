import statisticRepository from "../repositories/statisticRepository.js";

class statisticService {
    

    async getAllByUser(data){
        if (!data.id) { throw new Error("id needed") }
        return await statisticRepository.getByUserId(data.id)
    }

    async getStatAvg(data){
        if (!data.id) { throw new Error("id needed") }
        return await statisticRepository.getAvgByUser(data.id)
    }

}


export default new statisticService()