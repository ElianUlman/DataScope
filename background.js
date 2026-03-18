//BACKEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((mensaje, remitente, Respuesta) => {
    console.log("Mensaje recibido de:", remitente.tab ? "Content Script en pestaña " + remitente.tab.id : "Extensión");

    if (mensaje.tipo === "PROMPT") {
        console.log("Contenido:", mensaje.contenido)
        Respuesta({ status: "recibido_y_guardado" })
    }

    return true;
});