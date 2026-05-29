export async function getToken() {
    const storage = await chrome.storage.local.get(["token"])
    const raw = storage.token
    return typeof raw === 'object' && raw.token ? raw.token : raw
}

export async function saveUser(token, expiresAt, listaIAs, username) {
    return chrome.storage.local.set({
        token,
        expiresAt,
        user: { username, allowedAis: listaIAs, privateMode: false }
    })
}

export function parseAllowedAis(rawAllowedAis) {
    if (typeof rawAllowedAis === 'string') {
        return rawAllowedAis.replace(/[{}]/g, '').split(',').map(ia => ia.trim().toLowerCase())
    }
    if (Array.isArray(rawAllowedAis)) {
        return rawAllowedAis.map(ia => ia.toLowerCase().trim())
    }
    return []
}