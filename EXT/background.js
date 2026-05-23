const API_CLOUD = "https://datascope-api.onrender.com/api";
const API_LOCAL = "http://192.168.0.128:3000/api"

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.type === "USER_MESSAGE") {
        fetch(`${API_CLOUD}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: msg.content })
        })
            .then(res => res.text())
            .then(data => console.log("Respuesta de la API:", data))
            .catch(err => console.log("Error al conectar con la API:", err.message));

        return true;
    }

    if (msg.type === "LOGIN_API") {
        fetch(`${API_LOCAL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: msg.payload.email,
                password: msg.payload.password
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error en el servidor: Código ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.token) {
                    let listaIAs = [];

                    if (data.user && typeof data.user.allowed_ais === 'string') {
                        listaIAs = data.user.allowed_ais
                            .replace(/[{}]/g, '') // Quita las llaves { }
                            .split(',')           // Separa los elementos por comas
                            .map(ia => ia.trim().toLowerCase()); // Convierte todo a minúsculas
                    } else if (Array.isArray(data.user.allowed_ais)) {
                        listaIAs = data.user.allowed_ais.map(ia => ia.toLowerCase());
                    }

                    chrome.storage.local.set({
                        token: data.token,
                        allowedAis: listaIAs
                    }, () => {
                        sendResponse({ ok: true, token: data.token });
                    });

                    console.log("IAs Permitidas guardadas en la extensión:", listaIAs);

                } else {
                    sendResponse({ ok: false, error: data.error || "Credenciales incorrectas" });
                }
            })
            .catch(err => {
                console.error("Error atrapado en el login:", err.message);
                sendResponse({ ok: false, error: err.message });
            });

        return true;
    }
});