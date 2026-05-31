import { sendMessage, login } from './api.js'
import { getToken, saveSession, clearSession, parseAllowedAis, isSessionValid } from './storage.js'

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.type === "LOGOUT") {
        clearSession().then(() => {
            sendResponse({ ok: true });
        }).catch(err => {
            sendResponse({ ok: false, error: err.message });
        });
        return true;
    }

    if (msg.type === "USER_MESSAGE") {
        (async () => {
            try {
                const token = await getToken();
                if (!token) return sendResponse({ ok: false, error: "No autenticado" });

                const data = await sendMessage(msg.content, token);
                sendResponse({ ok: true });
            } catch (err) {
                sendResponse({ ok: false, error: err.message });
            }
        })();
        return true;
    }

    if (msg.type === "LOGIN_API") {
        (async () => {
            try {
                const data = await login(msg.payload.email, msg.payload.password);

                if (data.token) {
                    const listaIAs = parseAllowedAis(data.user?.allowedAis || data.user?.allowed_ais);
                    const username = data.user?.username || data.user?.name || "User";
                    const userData = { username, allowedAis: listaIAs, privateMode: false };

                    // Guarda en storage y cookie (ahora sin romperse)
                    await saveSession(data.token, data.expiresAt, userData);
                    sendResponse({ ok: true, token: data.token });
                } else {
                    sendResponse({ ok: false, error: data.error || "Credenciales incorrectas" });
                }
            } catch (err) {
                console.error("Error en login:", err.message);
                sendResponse({ ok: false, error: err.message });
            }
        })();
        return true;
    }

    if (msg.type === "CHECK_SESSION") {
        isSessionValid().then(valid => sendResponse({ ok: valid }));
        return true;
    }
});

// LISTENER DE COOKIES SEGURO
chrome.cookies.onChanged.addListener(async (changeInfo) => {
    const { cookie, removed, cause } = changeInfo;

    // Ignorar cambios causados por nosotros mismos
    if (cause === "overwrite" || cause === "explicit") return;

    const validDomains = ["onrender.com", "localhost", "192.168.0.128"];
    const isDomainValid = validDomains.some(domain => cookie.domain.includes(domain));

    if (isDomainValid && cookie.name === "datascope_token") {
        if (!removed) {
            await chrome.storage.local.set({
                token: cookie.value,
                expiresAt: cookie.expirationDate ? cookie.expirationDate * 1000 : Date.now() + (60 * 60 * 1000)
            });
        }
    } else {
        const storage = await chrome.storage.local.get(["token", "_clearing"]);

        // Si _clearing está activo, fuimos nosotros quienes borramos → ignorar
        if (storage._clearing) return;

        if (storage.token) {
            await chrome.storage.local.remove(["token", "expiresAt", "user"]);
        }
    }
});