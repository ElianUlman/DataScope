import(chrome.runtime.getURL('content/content.js'));

window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data?.type === "WEB_LOGIN" || event.data?.type === "WEB_LOGOUT") {
        chrome.runtime.sendMessage(event.data);
    }

    if (event.data?.source === "IA_DETECTOR_INJECTED" && event.data?.model) {
        console.log("[loader] modelo recibido via postMessage:", event.data.model, "— guardando en storage")
        chrome.storage.local.set({ currentModel: event.data.model }, () => {
            console.log("[loader] modelo guardado en storage:", event.data.model)
        });
    }
});