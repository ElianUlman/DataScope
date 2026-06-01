import userService from "../services/userService.js"
import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';

export const mfaVerification = async (req, res) =>{
    try{
        const mfaUser = req.mfaUser
        const {code} = req.body
        const { token, expiresAt, user } = await userService.MFA({id: mfaUser.id, code})

        res.status(200).json({
            success: true,
            token: token,
            expiresAt,
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                allowed_ais: user.allowed_ais || []
            }
        });
    }catch(error){
        console.log("error de MFA: "+error.message)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const createUser = async (req, res) => {
    try {

        const { name, email, password } = req.body
        await userService.createUser({ email, name, password })
        const { token, expiresAt, user } = await userService.login({ email, password })

        res.status(200).json({
            success: true,
            token: token,
            expiresAt,
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                allowed_ais: user.allowed_ais || []
            }
        });
    } catch (error) {
        console.error(`[REGISTER] ERROR — ${error.message}`)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { requiresMfa, token, expiresAt, user } = await userService.login({ email, password })


        if (requiresMfa) {
            res.status(200).json({
                requiresMfa: true,
                token: token
            })
        } else {
            res.status(200).json({
                success: true,
                token: token,
                expiresAt,
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                    allowed_ais: user.allowed_ais || []
                }
            });
        }



    } catch (error) {
        console.error(`[LOGIN] ERROR — email: ${req.body.email} | ${error.message}`);
        const isAuthError = error.message.includes("exist") || error.message.includes("password");
        res.status(isAuthError ? 401 : 500).json({ success: false, error: error.message });
    }
}

export const getUserData = async (req, res) => {
    try {
        res.status(200).json({ user: { "id": req.user.id, "username": req.user.username, "email": req.user.email, "allowed_ais": req.user.allowed_ais } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const updateUserData = async (req, res) => {
    try {
        await userService.changeUserData(req.body, req.user.id)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "error ocurred" })
    }
}
