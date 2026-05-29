const API_LOCAL = "http://10.152.2.105:3000/api"
const API_CLOUD = "https://datascope-api.onrender.com/api"

export async function sendMessage(content, token) {
    const res = await fetch(`${API_LOCAL}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ content, sender: "user" })
    })
    return res.text()
}

export async function login(email, password) {
    const res = await fetch(`${API_LOCAL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error(`Error en el servidor: Código ${res.status}`)
    return res.json()
}