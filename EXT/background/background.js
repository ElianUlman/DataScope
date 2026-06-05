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
            console.log("[background] USER_MESSAGE recibido — content:", msg.content, "platform:", msg.currentPlatform, "model:", msg.model)
            try {
                const token = await getToken();
                if (!token) {
                    console.warn("[background] no hay token, abortando")
                    return sendResponse({ ok: false, error: "No autenticado" });
                }
                console.log("[background] token obtenido — llamando sendMessage en api.js")
                const data = await sendMessage(msg.content, msg.currentPlatform, msg.model, token);
                console.log("[background] sendMessage completado")
                sendResponse({ ok: true });
            } catch (err) {
                console.error("[background] error:", err.message);
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

    if (msg.type === "WEB_LOGIN") {
        (async () => {
            const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 1 día
            await chrome.storage.local.set({
                token: msg.token,
                expiresAt: expiresAt
            });
            sendResponse({ ok: true });
        })();
        return true;
    }

    if (msg.type === "WEB_LOGOUT") {
        (async () => {
            const cookie = await chrome.cookies.get({
                url: "https://datascope-orhf.onrender.com/",
                name: "datascope_token"
            });
            if (!cookie) {
                await chrome.storage.local.remove(["token", "expiresAt", "user"]);
                console.log("[Background] Logout desde la web confirmado, sesión limpiada.");
            }
            sendResponse({ ok: true });
        })();
        return true;
    }
});

chrome.cookies.onChanged.addListener(async (changeInfo) => {
    const { cookie, removed, cause } = changeInfo;

    if (cause === "overwrite" || cause === "explicit") return;

    const validDomains = ["datascope-web-pruebas.onrender.com", "datascope-orhf.onrender.com/", "onrender.com", "localhost", "192.168.0.128"];
    const isDomainValid = validDomains.some(domain => cookie.domain.includes(domain));

    if (!isDomainValid || cookie.name !== "datascope_token") return;

    if (!removed) {
        // Cookie seteada desde la web → logueamos la extensión
        await chrome.storage.local.set({
            token: cookie.value,
            expiresAt: cookie.expirationDate ? cookie.expirationDate * 1000 : Date.now() + (60 * 60 * 1000)
        });
    } else {
        // Cookie borrada desde la web → deslogueamos la extensión
        const storage = await chrome.storage.local.get(["token", "_clearing"]);
        if (storage._clearing) return;
        if (storage.token) {
            await chrome.storage.local.remove(["token", "expiresAt", "user"]);
        }
    }
});