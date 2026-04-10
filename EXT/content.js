console.log("a");

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

//
function checkKeyboard(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const el = document.activeElement;
        editorWasEmpty = true;

        if (el && el.matches("textarea, [contenteditable='true']")) {
            const contenido = el.innerText || el.value || "";
            saveData(contenido);
        }
    }
}

//
function configEditor(element) {
    if (element && element.getAttribute('data-extension-configurado') !== 'true') {
        element.addEventListener('keyup', checkKeyboard);

        element.addEventListener('input', () => {
            const currentContent = element.value || element.innerText || "";
            const isCurrentlyEmpty = currentContent.trim() === "";

            if (editorWasEmpty && !isCurrentlyEmpty) {
                const newButton = findElement(document.body, "BUTTON");
                if (newButton) {
                    sendButton = newButton;
                    sendButton._lastScore = rank(newButton, "BUTTON");
                    attachButtonListener(sendButton, true);
                }
            }
            editorWasEmpty = isCurrentlyEmpty;
        });

        element.setAttribute('data-extension-configurado', 'true');
    }
}

//
function attachButtonListener(btn, force = false) {
    if (!btn) return;

    if (btn.dataset.extensionConfigurado === "true" && !force) return;

    btn.removeEventListener("click", handleButtonClick);
    btn.addEventListener("click", handleButtonClick);

    btn.dataset.extensionConfigurado = "true";
    console.log("🔘 Botón de envío vinculado/actualizado:", btn);
}

function handleButtonClick() {
    editorWasEmpty = true;
    const contenido = editor?.innerText || editor?.value || "";
    if (contenido.trim()) {
        saveData(contenido);
    }
}

//
function isButtonValid(btn) {
    if (!btn) return false;
    return document.contains(btn) && btn.offsetParent !== null;
}

let globalCandidates = {
    EDITOR: new Set(),
    BUTTON: new Set()
};

let heuristics = {

    EDITOR: {
        Id: ["prompt", "textarea", "user", "input", "ask"],
        Class: ["input", "textarea", "user", "input"],
        Role: ["textbox"],
        Arialabel: ["chat", "prompt"],
        PlaceHolder: ["message", "chat", "prompt"]
    },

    BUTTON: {
        Id: ["submit", "button",],
        Class: ["submit", "buton", "btn"],
        Arialabel: ["send", "message", "prompt"],
    }
}

//
function rank(element, type) {
    let score = 0;
    let config = heuristics[type];

    if (!element || !(element instanceof HTMLElement) || element.offsetParent === null) return -Infinity;

    let elementConfig = {
        Id: element.id || "",
        Class: typeof element.className === 'string' ? element.className : (element.getAttribute("class") || ""),
        Role: element.getAttribute("role") || "",
        Arialabel: element.getAttribute("aria-label") || "",
        PlaceHolder: element.getAttribute("placeholder") || "",
        Name: element.getAttribute("name") || ""
    };

    for (const category in config) {
        const words = config[category];
        const value = (elementConfig[category] || "").toLowerCase();
        if (words && words.length > 0) {
            words.forEach(word => {
                if (value.includes(word.toLowerCase())) {
                    score += (category !== "Class") ? 50 : 10;
                }
            });
        }
    }

    const rect = element.getBoundingClientRect();

    if (type === "BUTTON") {
        const ratio = rect.width / rect.height;
        if (ratio > 0.7 && ratio < 1.4) {
            score += 60;
        }

        if (rect.width > 120 || rect.height > 80) {
            score -= 300;
        }

        if (editor) {
            const editorRect = editor.getBoundingClientRect();
            const buttonCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            const editorCenter = { x: editorRect.left + editorRect.width / 2, y: editorRect.top + editorRect.height / 2 };

            const distance = Math.hypot(buttonCenter.x - editorCenter.x, buttonCenter.y - editorCenter.y);

            if (distance < 100) score += 150;
            else if (distance < 250) score += 50;

            if (rect.top >= editorRect.top && rect.left >= editorRect.left) {
                score += 40;
            }
        }
    }

    if (type === "EDITOR" && element.tagName === "TEXTAREA") score += 200;
    if (element === document.activeElement) score += 1000;

    const area = rect.width * rect.height;
    score += Math.min(area, 5000) / 1000;

    const identifier = `${element.tagName}${element.id ? '#' + element.id : ''}${element.className && typeof element.className === 'string' ? '.' + element.className.split(' ').join('.') : ''}`;
    console.log(`[Ranking ${type}] Score: ${score.toFixed(2)} | Elemento:`, element);


    return score;
}

function findElement(root, type) {

    let config = heuristics[type]
    const candidates = []

    let maxScore = -Infinity
    let best = null

    let selector
    if (type === "EDITOR") {
        selector = "textarea, [contenteditable='true']"
    }
    else {
        selector = "button, [role='button'], input[type='submit']"
    }

    if (root) {
        if (root.matches && root.matches(selector)) {
            globalCandidates[type].add(root);
        }
        root.querySelectorAll(selector).forEach(el => globalCandidates[type].add(el));
    }

    globalCandidates[type].forEach(el => {

        if (!document.contains(el)) {
            globalCandidates[type].delete(el);
        }

    });

    for (const element of globalCandidates[type]) {

        const currentScore = rank(element, type);

        if (currentScore > maxScore && currentScore > -Infinity) {

            maxScore = currentScore;
            best = element;

        }
    }

    return best
}



let editor = null;
let sendButton = null;
let lastText = ""
let editorWasEmpty = true;

editor = findElement(document.body, "EDITOR");
if (editor) {
    configEditor(editor);
}

sendButton = findElement(document.body, "BUTTON");
if (sendButton) {
    attachButtonListener(sendButton);
}



const observer = new MutationObserver((mutationList) => {
    let structureChanged = false;

    for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            findElement(node, "EDITOR");
            findElement(node, "BUTTON");
            structureChanged = true;
        }
    }

    if (!editor || !document.contains(editor) || editor.offsetParent === null) {
        const newEditor = findElement(null, "EDITOR");

        if (newEditor && newEditor !== editor) {

            if (editor) {
                editor.removeEventListener('keyup', checkKeyboard);
            }

            editor = newEditor;
            configEditor(editor);
            console.log("Nuevo editor detectado:", editor);
        }
    }


    const bestButton = findElement(document.body, "BUTTON");

    // Si encontramos un mejor botón O si el botón actual ha evolucionado (mejor score)
    if (bestButton && (bestButton !== sendButton || rank(bestButton, "BUTTON") > (sendButton?._lastScore || -Infinity))) {

        // Guardamos el score actual dentro del elemento para futuras comparaciones
        bestButton._lastScore = rank(bestButton, "BUTTON");

        sendButton = bestButton;

        // Forzamos el listener ignorando si ya tenía uno (lo manejamos dentro de la función)
        attachButtonListener(sendButton, true);
    }
});

observer.observe(document.body, { childList: true, subtree: true });
