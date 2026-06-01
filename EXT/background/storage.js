// Variable para cambiar fácilmente entre entorno local y producción
const IS_LOCAL_DEV = false;

// WEB_URL se usa para tu web. COOKIE_URL se usa para la API de Chrome (sin puerto).
const WEB_URL = IS_LOCAL_DEV ? "http://192.168.0.128:5173" : "https://datascope-orhf.onrender.com/";
const COOKIE_URL = IS_LOCAL_DEV ? "http://192.168.0.128" : "https://datascope-orhf.onrender.com/";

const COOKIE_NAME = "datascope_token";

export function parseAllowedAis(rawAllowedAis) {
    if (typeof rawAllowedAis === 'string') {
        return rawAllowedAis.replace(/[{}]/g, '').split(',').map(ia => ia.trim().toLowerCase());
    }
    if (Array.isArray(rawAllowedAis)) {
        return rawAllowedAis.map(ia => ia.toLowerCase().trim());
    }
    return [];
}

export async function saveSession(token, expiresAt, userData) {
    // 1. Guardamos en memoria local
    await chrome.storage.local.set({ token, expiresAt, user: userData });

    // 2. Usamos la URL sin puerto para que Chrome no bloquee la cookie
    const isSecureConnection = COOKIE_URL.startsWith("https");

    try {
        await chrome.cookies.set({
            url: COOKIE_URL,
            name: COOKIE_NAME,
            value: token,
            expirationDate: expiresAt / 1000,
            secure: isSecureConnection,
            sameSite: "lax",
            httpOnly: false
        });
    } catch (err) {
        console.error("[DataScope] Error al guardar la cookie:", err);
        throw err; // Lanzamos el error para que el login lo atrape si algo falla de verdad
    }
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
        console.log("[clearSession] Cookie eliminada:", result);
    } catch (e) {
        console.error("[clearSession] Error:", e.message);
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