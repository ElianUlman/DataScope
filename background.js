//BACKEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.type === "PROMPT") {
        console.log("Contenido:", msg.content);
        sendResponse({ status: "recibido_y_guardado" });
    }

    if (msg.type === "SEND_API") {
        enviarDatos(msg.payload)
            .then((data) => sendResponse({ ok: true, data }))
            .catch((error) => sendResponse({ ok: false, error: error.message }));

        return true;
    }
});

async function enviarDatos(data) {
    console.log("Enviando datos a la API:", data);

    const response = await fetch("http://127.0.0.1:3000/api/loginCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    console.log("Status de la respuesta:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    const resJson = await response.json();
    console.log("Respuesta JSON:", resJson);
    return resJson;
}