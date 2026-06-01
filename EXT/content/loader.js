import(chrome.runtime.getURL('content/content.js'));

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.type === "WEB_LOGIN" || event.data?.type === "WEB_LOGOUT") {
        chrome.runtime.sendMessage(event.data);
    }
});