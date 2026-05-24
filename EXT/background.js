const API_CLOUD = "https://datascope-api.onrender.com/api";
const API_LOCAL = "http://192.168.0.128:3000/api"

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    console.log(`se recibio un mensaje: ${msg}, ${sender}`)

    if (msg.type === "USER_MESSAGE") {

        const storage = await chrome.storage.local.get(["currentAi", "token"]);

        const rawToken = storage.token;
        const cleanToken = typeof rawToken === 'object' && rawToken.token ? rawToken.token : rawToken;

        console.log("token enviado:", cleanToken);
        console.log("sender:", storage.currentAi);

        try {
            const res = await fetch(`${API_LOCAL}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": cleanToken
                },
                body: JSON.stringify({
                    content: msg.content,
                    sender: "user"
                    //sender podria ser la IA: storage.currentAi
                })
            });
            const data = await res.text();
            console.log("Respuesta de la API:", data);
        } catch (err) {
            console.log("Error al conectar con la API:", err.message);
        }

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

                    const rawAllowedAis = data.user?.allowedAis || data.user?.allowed_ais;

                    if (typeof rawAllowedAis === 'string') {
                        listaIAs = rawAllowedAis
                            .replace(/[{}]/g, '') 
                            .split(',')           
                            .map(ia => ia.trim().toLowerCase());
                    } else if (Array.isArray(rawAllowedAis)) {
                        listaIAs = rawAllowedAis.map(ia => ia.toLowerCase().trim());
                    }

                    chrome.storage.local.set({
                        token: data.token,
                        expiresAt: data.expiresAt,
                        user: {
                            username: data.user.username || data.user.name || "User",
                            allowedAis: listaIAs,
                            privateMode: false
                        }
                    }, () => {
                        sendResponse({ ok: true, token: data.token });
                    });

                    console.log("IAs Permitidas guardadas en la extensión:", listaIAs);
                    console.log("El token expirará en el timestamp:", data.expiresAt);

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