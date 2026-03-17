//BACKEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "Prompt Enviado") {
        console.log("Mensaje recibido del content script:", message.data);
    }
});