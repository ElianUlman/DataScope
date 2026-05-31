//const WEB_URL = "https://datascope-orhf.onrender.com"
const WEB_URL = "http://192.168.0.128:5173"
const COOKIE_NAME = "datascope_token"

export function parseAllowedAis(rawAllowedAis) {
    if (typeof rawAllowedAis === 'string') {
        return rawAllowedAis.replace(/[{}]/g, '').split(',').map(ia => ia.trim().toLowerCase())
    }
    if (Array.isArray(rawAllowedAis)) {
        return rawAllowedAis.map(ia => ia.toLowerCase().trim())
    }
    return []
}

export async function saveSession(token, expiresAt, userData) {
    await chrome.storage.local.set({
        token,
        expiresAt,
        user: userData
    })

    await chrome.cookies.set({
        url: WEB_URL,
        name: COOKIE_NAME,
        value: token,
        expirationDate: expiresAt / 1000,
        secure: true,
        sameSite: "lax"
    })
}

export async function clearSession() {
    await chrome.storage.local.remove(["token", "expiresAt", "user"])

    await chrome.cookies.remove({
        url: WEB_URL,
        name: COOKIE_NAME
    })
}

export async function getToken() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"])

    if (storage.token) return storage.token

    const cookie = await chrome.cookies.get({
        url: WEB_URL,
        name: COOKIE_NAME
    })

    if (cookie?.value) {
        await chrome.storage.local.set({ token: cookie.value })
        return cookie.value
    }

    return null
}

export async function isSessionValid() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"])
    console.log(`STORAGE: ${storage}`)

    if (!storage.token) {
        const cookie = await chrome.cookies.get({
            url: WEB_URL,
            name: COOKIE_NAME
        })

        console.log(`COOKIE: ${cookie}`)

        if (cookie?.value) {
            await chrome.storage.local.set({ token: cookie.value })
            return true
        }

        return false
    }

    if (storage.expiresAt && Date.now() > storage.expiresAt) {
        await clearSession()
        return false
    }

    return true
}