import { sendMessage, login } from './api.js'
import { getToken, saveSession, clearSession, parseAllowedAis, isSessionValid } from './storage.js'

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    if (msg.type === "USER_MESSAGE") {
        try {
            const token = await getToken()

            if (!token) {
                console.warn("[DataScope] No hay token disponible")
                sendResponse({ ok: false, error: "No autenticado" })
                return true
            }

            const data = await sendMessage(msg.content, token)
            console.log("Respuesta de la API:", data)
            sendResponse({ ok: true })
        } catch (err) {
            console.log("Error al conectar con la API:", err.message)
            sendResponse({ ok: false, error: err.message })
        }
        return true
    }

    if (msg.type === "LOGIN_API") {
        try {
            const data = await login(msg.payload.email, msg.payload.password)

            if (data.token) {
                const listaIAs = parseAllowedAis(data.user?.allowedAis || data.user?.allowed_ais)
                const username = data.user?.username || data.user?.name || "User"

                const userData = {
                    username,
                    allowedAis: listaIAs,
                    privateMode: false
                }

                // guarda en storage Y en cookie
                await saveSession(data.token, data.expiresAt, userData)

                sendResponse({ ok: true, token: data.token })
            } else {
                sendResponse({ ok: false, error: data.error || "Credenciales incorrectas" })
            }
        } catch (err) {
            console.error("Error en login:", err.message)
            sendResponse({ ok: false, error: err.message })
        }
        return true
    }

    if (msg.type === "LOGOUT") {
        await clearSession()
        sendResponse({ ok: true })
        return true
    }

    if (msg.type === "CHECK_SESSION") {
        const valid = await isSessionValid()
        sendResponse({ ok: valid })
        return true
    }
})

chrome.cookies.onChanged.addListener(async (changeInfo) => {
    const { cookie, removed } = changeInfo;

    if (cookie.name === "datascope_token") {
        console.log("[Background] Cambio detectado en la cookie de sesión:", cookie);

        if (!removed) {
            await chrome.storage.local.set({ 
                token: cookie.value,
                expiresAt: cookie.expirationDate ? cookie.expirationDate * 1000 : Date.now() + (60 * 60 * 1000)
            });
        } else {
            await clearSession();
        }
    }
});