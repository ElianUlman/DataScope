import inviteService from "../services/inviteService.js";

export const getInvites = async (req,res)=>{
    try{
        const id = req.body.companyId
        const invites = await inviteService.getInvitesByCompanyId({id})
        res.status(200).json(invites)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}

export const createInvite = async (req, res) =>{
    try{
        const {targetUserMail, area} = req.body
        const companyId= req.targetCompanyId

        const invite = await inviteService.createInvite({targetUserMail, companyId, area})

        res.status(201).json(invite)
    }catch(e){
        console.log(e)
        res.status(500).json({error: "error ocurred"})
    }
}
