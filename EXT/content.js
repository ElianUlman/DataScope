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

const presentConfig = getConfig();
let editor;
let lastUrl = location.href;
let lastText = "";


function configEditor(element) {
    if (element.getAttribute('data-extension-configurado') !== 'true') {
        element.addEventListener('keydown', checkKeyboard);
        element.setAttribute('data-extension-configurado', 'true');
        console.log("Listener vinculado exitosamente");
    }
}

function scanNode(node) {
    if (!(node instanceof HTMLElement)) return;

    const candidates = [
        node,
        ...node.querySelectorAll("textarea, [contenteditable='true']")
    ];

    for (const element of candidates) {
        if (isValidEditor(element)) {
            possibleEditors.add(element);
        }
    }
}

if (presentConfig) {

    document.addEventListener('click', (e) => {

        const sendButton = e.target.closest(presentConfig.button);
        if (sendButton) {
            const content = editor.innerText || editor.value;
            console.log("Botón presionado. Contenido:", content);
            saveData(content);
        }
    }, true);

    const observer = new MutationObserver((mutationList) => {

        let posibleEditors = new Set()

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

        if (location.href !== lastUrl && !editor) {
            console.log("cambio la url")
            lastUrl = location.href;
            if (editor) {
                editor.removeEventListener('keydown', checkKeyboard);
                editor = null;
            }
        }

        const element = document.querySelector(presentConfig.editor);

        if (element && editor !== element) {
            console.log("¡Nuevo elemento encontrado!", element);
            editor = element;
            configEditor(editor);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}