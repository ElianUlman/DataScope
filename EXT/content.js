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

function checkKeyboard(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const el = document.activeElement;

        if (el && el.matches("textarea, [contenteditable='true']")) {
            const contenido = el.innerText || el.value || "";
            saveData(contenido);
        }
    }
}

function configEditor(element) {
    if (element && element.getAttribute('data-extension-configurado') !== 'true') {
        element.addEventListener('keyup', checkKeyboard);
        element.setAttribute('data-extension-configurado', 'true');
    }
}

function scanButtons(node) {
    if (!(node instanceof HTMLElement)) return;

    const candidates = [
        node,
        ...node.querySelectorAll("button, [role='button']")
    ];

    for (const elements of candidates) {

        const text = (elements.innerText || elements.getAttribute("aria-label") || "").toLowerCase();

        if (
            text.includes("send") ||
            text.includes("enviar") ||
            text.includes("submit") ||
            elements.type === "submit"
        ) {
            if (elements.offsetParent !== null) {
                possibleButtons.add(elements);
            }
        }
    }
}

function pickButton(buttons) {

    let best = null;
    let bestScore = -Infinity;

    for (const btn of buttons) {
        let score = 0;

        const rect = btn.getBoundingClientRect();
        const text = (btn.innerText || btn.getAttribute("aria-label") || "").toLowerCase();

        score += rect.width * rect.height;

        score += (window.innerHeight - rect.top);

        if (text.includes("send") || text.includes("enviar")) score += 500;

        if (btn.offsetParent === null) score -= 1000;

        if (score > bestScore) {
            bestScore = score;
            best = btn;
        }
    }

    return best;
}

function scanNode(node) {
    if (!(node instanceof HTMLElement)) return;

    if (node.matches("textarea, [contenteditable='true']") && node.offsetParent !== null) {
        possibleEditors.add(node);
    }

    const children = node.querySelectorAll("textarea, [contenteditable='true']");

    for (const child of children) {
        if (child.offsetParent !== null) {
            possibleEditors.add(child);
        }
    }
}

function initialScan() {
    const nodes = document.querySelectorAll("textarea, [contenteditable='true']");

    for (const node of nodes) {
        if (node.offsetParent !== null) {
            possibleEditors.add(node);
        }
    }

    return discard(possibleEditors);
}

function searchEditor(mutationList) {

    let posibleEditors = new Set()

    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {

                if (!(node instanceof HTMLElement)) continue;

                if (node.matches("textarea, [contenteditable='true']") && node.offsetParent !== null) {
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

    return discard(posibleEditors);
}

function discard(posibleEditors) {

    let best = null;
    let bestScore = -Infinity;

    for (const candidato of posibleEditors) {
        let score = 0;

        const rect = candidato.getBoundingClientRect();
        const text = (candidato.placeholder || candidato.getAttribute("aria-label") || "").toLowerCase();

        if (candidato === document.activeElement) {
            score += 1000;
        }

        score += rect.width * rect.height;
        score += (window.innerHeight - rect.top);

        if (candidato.offsetParent === null) {
            score -= 1000;
        }

        if (text.includes("message") || text.includes("mensaje")) {
            score += 300;
        }

        if (score > bestScore) {
            bestScore = score;
            best = candidato;
        }
    }

    return best;
}

let possibleEditors = new Set();
let possibleButtons = new Set();
let editor = null;
let sendButton = null;
let lastText = "";


scanNode(document.body);

editor = initialScan();
configEditor(editor);

scanButtons(document.body)

const observer = new MutationObserver((mutationList) => {

    for (const mutation of mutationList) {
        mutation.addedNodes.forEach(node => {
            scanNode(node);
            scanButtons(node);
        });
    }

    if (!editor || !document.contains(editor) || editor.offsetParent === null) {

        let newEditor = discard(possibleEditors);

        if (!newEditor) {
            newEditor = initialScan();
        }

        if (!newEditor) {
            newEditor = searchEditor(mutationList);
        }

        if (newEditor) {

            if (editor) {
                editor.removeEventListener('keydown', checkKeyboard);
            }

            editor = newEditor;
            configEditor(editor);

            console.log("Nuevo editor:", editor);
        }
    }

    sendButton = pickButton(possibleButtons);

    if (sendButton && !sendButton.dataset.listener) {

        sendButton.addEventListener("click", () => {
            const el = document.activeElement;
            const contenido = el?.innerText || el?.value || "";
            saveData(contenido);
        });

        sendButton.dataset.listener = "true";
    }
});

observer.observe(document.body, { childList: true, subtree: true });