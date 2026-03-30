//BACKEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, answer) => {
    console.log("Mensaje recibido de:", sender.tab ? "Content Script en pestaña " + sender.tab.id : "Extensión");

    if (msg.type === "PROMPT") {
        console.log("Contenido:", msg.content)
        Respuesta({ status: "recibido_y_guardado" })
    }

    return true;
});

async function enviarDatos(data) {
    const response = await fetch("https://tu-api.com/loginCompany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ dato: data })
    });

    if (!response.ok) {
        throw new Error("Error en la API");
    }

    return await response.json();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SEND_API") {
        enviarDatos(request.payload)
            .then((data) => sendResponse({ ok: true, data }))
            .catch((error) => sendResponse({ ok: false, error: error.message }));

        return true;
    }
});