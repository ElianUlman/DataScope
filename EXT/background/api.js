const API_LOCAL = "http://10.152.2.105:3000/api"
const API_CLOUD = "https://datascope-api-pruebas.onrender.com/api"
const API_CASA = "http://192.168.0.128:3000/api"

export async function sendMessage(content, platform, model, token) {
    console.log("API: " + content, platform, model)
    const res = await fetch(`${API_CLOUD}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ content, platform, sender: "user", model })
    })
    const textResponse = await res.text();
    console.log("Respuesta API: " + textResponse);
    return textResponse
}

export async function login(email, password) {
    const res = await fetch(`${API_CLOUD}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error(`Error en el servidor: Código ${res.status}`)
    const jsonResponse = await res.json(); 
    console.log("Respuesta API Login:", JSON.stringify(jsonResponse));
    
    return jsonResponse;
}