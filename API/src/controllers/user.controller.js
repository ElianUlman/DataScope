import userService from "../services/userService.js"
import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        
        console.log(`[API REGISTER] Intento de registro recibido. Datos: Email=${req.body.email}, Name=${req.body.name}`);
        const { name, email, password } = req.body
        await userService.createUser({ email, name, password })
        const { token, expiresAt, user } = await userService.login({ email, password })

        console.log(`[API REGISTER SUCCESS] Usuario registrado y logueado correctamente: ${user.email}`);
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
        console.error(`[API LOGIN ERROR] Fallo al iniciar sesión. Email=${req.body.email}. Detalles:`, error);
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
