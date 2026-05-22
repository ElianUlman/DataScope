import userService from "../services/userService.js"
import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body
        await userService.createUser({ email, name, password })
        const token = await userService.login({ email, password })

        console.log(`[REGISTER] OK — usuario: ${name} | email: ${email}`)
        res.status(201).json({ token })
    } catch (error) {
        console.error(`[REGISTER] ERROR — ${error.message}`)
        res.status(500).json({ error: "error ocurred" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. El servicio valida todo. Si la contraseña falla, salta directo al catch.
        const token = await userService.login({ email, password });

        // 2. Buscamos al usuario usando tu método findByEmail del repositorio
        const user = await userRepository.findByEmail(email);

        console.log(`[LOGIN] OK — email: ${email}`);
        
        // 3. Enviamos la respuesta con el formato exacto que necesita tu extensión
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.name, // Asegúrate de que en tu tabla de Postgres la columna sea 'name'
                email: user.email,
                allowed_ais: user.allowed_ais || [] // Si la columna es null en Postgres, envía un array vacío
            }
        });

    } catch (error) {
        console.error(`[LOGIN] ERROR — email: ${req.body.email} | ${error.message}`);
        
        // Manejo de errores de credenciales
        const isAuthError = error.message.includes("exist") || error.message.includes("password");
        res.status(isAuthError ? 401 : 500).json({ 
            success: false, 
            error: error.message 
        });
    }
}

export const getUserData = async (req, res) => {
    try {
        res.status(200).json({ "id": req.user.id, "username": req.user.name, "email": req.user.email, "allowed_ais": req.user.allowed_ais })
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
