import userService from "../services/userService.js"

export const createUser = async (req,res)=>{
    try{
        const {email, name, password} = req.body
        await userService.createUser({email, name, password})
        const token = await userService.login({email, password})

        console.log(`[REGISTER] OK — usuario: ${name} | email: ${email}`)
        res.status(201).json({token})
    }catch(error){
        console.error(`[REGISTER] ERROR — ${error.message}`)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const loginUser = async (req,res)=>{
    try{
        const {email, password} = req.body
        const token = await userService.login({email, password})

        console.log(`[LOGIN] OK — email: ${email}`)
        res.status(200).json({token})

    }catch(error){
        console.error(`[LOGIN] ERROR — email: ${req.body.email} | ${error.message}`)
        res.status(500).json({error: "error ocurred"})
    }
}

export const getUserData = async (req,res) => { 
    try{
        const id = req.user.id
        res.status(200).json(await userService.getUserData({id}))
    }catch(error){
        console.log(error)
        res.status(500).json({error: "error ocurred"})
    }
}