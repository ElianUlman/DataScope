import { sendMessage, login } from './api.js'
import { getToken, saveUser, parseAllowedAis } from './storage.js'

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    if (msg.type === "USER_MESSAGE") {
        try {
            const token = await getToken()
            const data = await sendMessage(msg.content, token)
            console.log("Respuesta de la API:", data)
        } catch (err) {
            console.log("Error al conectar con la API:", err.message)
        }
        return true
    }

    if (msg.type === "LOGIN_API") {
        try {
            const data = await login(msg.payload.email, msg.payload.password)
            if (data.token) {
                const listaIAs = parseAllowedAis(data.user?.allowedAis || data.user?.allowed_ais)
                const username = data.user.username || data.user.name || "User"
                await saveUser(data.token, data.expiresAt, listaIAs, username)
                sendResponse({ ok: true, token: data.token })
            } else {
                sendResponse({ ok: false, error: data.error || "Credenciales incorrectas" })
            }
        } catch (err) {
            sendResponse({ ok: false, error: err.message })
        }
        return true
    }
})