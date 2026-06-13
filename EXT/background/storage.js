const IS_LOCAL_DEV = false
const WEB_URL = IS_LOCAL_DEV ? "http://192.168.0.128:5173" : "https://datascope-web-pruebas.onrender.com";
const COOKIE_URL = IS_LOCAL_DEV ? "http://192.168.0.128" : "https://datascope-web-pruebas.onrender.com";

const COOKIE_NAME = "datascope_token"
export async function saveSession(token, expiresAt, userData) {
    await chrome.storage.local.set({ token, expiresAt, user: userData });
    
    // Bandera para evitar que nuestro propio cambio de cookie confunda al background
    await chrome.storage.local.set({ _clearing: true }); 

    const urlObj = new URL(COOKIE_URL);
    
    try {
        await chrome.cookies.set({
            url: COOKIE_URL,
            name: COOKIE_NAME,
            value: token,
            expirationDate: expiresAt / 1000,
            secure: true,
            sameSite: "no_restriction",
            domain: urlObj.hostname, 
            path: "/"
        });
    } catch (err) {
        console.error("[EXT STORAGE ERROR] Fallo fatal al intentar guardar la cookie de sesión:", err);
    } finally {
        setTimeout(async () => {
            await chrome.storage.local.remove("_clearing");
        }, 500);
    }
}

export function parseAllowedAis(rawAllowedAis) {
    if (typeof rawAllowedAis === 'string') {
        return rawAllowedAis.replace(/[{}]/g, '').split(',').map(ia => ia.trim().toLowerCase());
    }
    if (Array.isArray(rawAllowedAis)) {
        return rawAllowedAis.map(ia => ia.toLowerCase().trim());
    }
    return [];
}

// storage.js

export async function clearSession() {
    // Primero limpiamos storage
    await chrome.storage.local.remove(["token", "expiresAt", "user"]);

    // Marcamos que nosotros iniciamos este borrado
    await chrome.storage.local.set({ _clearing: true });

    try {
        const result = await chrome.cookies.remove({
            url: COOKIE_URL,
            name: COOKIE_NAME
        });
    } catch (e) {
        console.error("[EXT STORAGE ERROR] Fallo al eliminar cookie en clearSession:", e);
    } finally {
        await chrome.storage.local.remove("_clearing");
    }
}

export async function getToken() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"]);
    if (storage.token) return storage.token;

    const cookie = await chrome.cookies.get({ url: COOKIE_URL, name: COOKIE_NAME });

    if (cookie?.value) {
        await chrome.storage.local.set({ token: cookie.value });
        return cookie.value;
    }
    return null;
}

export async function isSessionValid() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"]);

    if (!storage.token) {
        const cookie = await chrome.cookies.get({ url: COOKIE_URL, name: COOKIE_NAME });
        if (cookie?.value) {
            await chrome.storage.local.set({ token: cookie.value });
            return true;
        }
        return false;
    }

    if (storage.expiresAt && Date.now() > storage.expiresAt) {
        await clearSession();
        return false;
    }
    return true;
}