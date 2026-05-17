import userService from "../services/userService.js"

export const createUser = async (req,res)=>{
    try{
        const {email, name, password} = req.body
        await userService.createUser({email, name, password})
        const token = await userService.login({email, password})

        res.status(201).json({token})
    }catch(error){
        console.log(error)
        res.status(500).json({ error: "error ocurred" }) //error is placeholder for now :/
    }
}

export const loginUser = async (req,res)=>{
   
    try{

        const {email, password} = req.body
        const token = await userService.login({email, password})
        res.status(200).json({token})

    }catch(error){
        console.log(error)
        res.status(500).json({error: "error ocurred"})
    }
}

export const getUserData = async (req,res) => { 
    try{
        res.status(200).json({ "id": req.user.id, "username": req.user.name, "email": req.user.email, "allowed_ais": req.user.allowed_ais})
    }catch(error){
        console.log(error)
        res.status(500).json({error: "error ocurred"})
    }
}

export const updateUserData = async (req,res) => {
    try{
        await userService.changeUserData(req.body, req.user.id)
        res.status(204).send()
    }catch(error){
        console.log(error)
        res.status(500).json({error: "error ocurred"})
    }
}
