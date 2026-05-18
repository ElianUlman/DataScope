// BACKEND DE LA EXTENSION

const API_BASE = "http://127.0.0.1:3000/api";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.type === "USER_MESSAGE") {
        fetch(`${API_BASE}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: msg.content })
        })
        .then(res => res.text())
        .then(data => console.log("Respuesta de la API:", data))
        .catch(err => console.log("Error al conectar con la API:", err.message));
    }

    if (msg.type === "REGISTER_API") {
        fetch(`${API_BASE}/user`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: msg.payload.name,
                email: msg.payload.email,
                password: msg.payload.password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                // Guardar el token para uso posterior
                chrome.storage.local.set({ token: data.token });
                sendResponse({ ok: true, token: data.token });
            } else {
                sendResponse({ ok: false, error: data.error || "Error desconocido" });
            }
        })
        .catch(err => sendResponse({ ok: false, error: err.message }));

        return true; // necesario para que sendResponse funcione de forma async
    }

    return true;
});