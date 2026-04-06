const CONFIG_SITES = {
    'chatgpt.com': {
        editor: 'div[id="prompt-textarea"]',
        button: 'button[data-testid="send-button"]'
    },
    'gemini.google.com': {
        editor: 'div[role="textbox"]',
        button: 'button[aria-label*="Enviar"], .send-button'
    },
    'copilot.microsoft.com': {
        editor: '#userInput',
        button: 'button[data-testid="submit-button"], button[aria-label*="Submit"]'
    }
};

function saveData(text) {
    const cleanText = text.trim();

    if (cleanText !== "" && cleanText !== lastText) {
        lastText = cleanText;

        const DATOS = { type: "PROMPT", content: cleanText };
        chrome.runtime.sendMessage(DATOS, (res) => {
            if (chrome.runtime.lastError) {
                console.warn("Error enviando:", chrome.runtime.lastError.message);
            }
        });
    }
}

function getConfig() {
    const host = window.location.hostname;
    let config = null

    for (const domain in CONFIG_SITES) {
        if (host.includes(domain)) {
            config = CONFIG_SITES[domain];
        }
    }

    return config;
}

function checkKeyboard(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const contenido = e.currentTarget.innerText || e.currentTarget.value;
        console.log("Enter detectado. Contenido:", contenido);
        saveData(contenido);
    }
}

function configEditor(element) {
    if (element.getAttribute('data-extension-configurado') !== 'true') {
        element.addEventListener('keydown', checkKeyboard);
        element.setAttribute('data-extension-configurado', 'true');
        console.log("Listener vinculado exitosamente");
    }
}

function searchEditor(mutationList) {

    let posibleEditors = new Set()
    let editor = null

    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {

                if (!(node instanceof HTMLElement)) {
                    continue;
                }

                if (node.matches("textarea, [contenteditable='true']") && node.offsetParent !== null) {
                    console.log(node.tagName);
                    posibleEditors.add(node)
                }

                const children = node.querySelectorAll("textarea, [contenteditable='true']");
                for (const child of children) {
                    if (child.offsetParent !== null) {
                        posibleEditors.add(child);
                    }
                }
            }
        }
    }

    editor = discard(posibleEditors)
    return editor
}

function discard(posibleEditors) {

    let ranking = []

    for(const candidato of posibleEditors){
        let score = 0
        const rect = candidato.getBoundingClientRect();
        const text = (candidato.placeholder || candidato.getAttribute("aria-label") || "").toLowerCase();

        if (candidato === document.activeElement){
            score += 1000
        }

        score += rect.width * rect.height;
        score += (window.innerHeight - rect.top);

        if (candidato.offsetParent === null){
            score -= 1000
        }

        if (text.includes("message") || text.includes("mensaje")){
            score += 300
        }

        ranking[candidato] = score
    }
}

const presentConfig = getConfig();
let editor = null;
let lastUrl = location.href;
let lastText = "";



const observer = new MutationObserver((mutationList) => {

    if (location.href !== lastUrl) {
        console.log("cambio la url")
        lastUrl = location.href;

        if (!editor) {
            editor.removeEventListener('keydown', checkKeyboard)
            editor = searchEditor(mutationList)

            configEditor(editor)

            console.log("¡Nuevo elemento encontrado!", element);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
