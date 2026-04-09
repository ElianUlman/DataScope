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

function attachButtonListener(btn) {
    if (!btn || btn.dataset.listener === "true") return;

    btn.addEventListener("click", () => {
        // Usamos el editor que ya tenemos identificado como el mejor
        const contenido = editor?.innerText || editor?.value || "";
        if (contenido.trim()) {
            saveData(contenido);
        }
    });

    btn.dataset.listener = "true";
    console.log("🔘 Botón de envío vinculado:", btn);
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

    if (element === document.activeElement) {
        score += 1000;
    }

    if (type === "EDITOR" && element.tagName === "TEXTAREA") {
        score += 200;
    }

    for (const category in config) {
        const words = config[category];
        
        const rawValue = elementConfig[category] || "";
        const value = rawValue.toLowerCase();

        if (words && words.length > 0) {
            words.forEach(word => {
                if (value.includes(word.toLowerCase())) {
                    if (category !== "Class") {
                        score += 50;
                    } else {
                        score += 10;
                    }
                }
            });
        }
    }

    const rect = element.getBoundingClientRect();
    score += (rect.width * rect.height) / 1000;

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

editor = findElement(document.body, "EDITOR");
if (editor){
    configEditor(editor);
} 

sendButton = findElement(document.body, "BUTTON");
if(sendButton){
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
                editor.removeEventListener('keydown', checkKeyboard);
            }

            editor = newEditor;
            configEditor(editor);
            console.log("Nuevo editor detectado:", editor);
        }
    }

    const bestButton = findElement(null, "BUTTON");

    if (bestButton && bestButton !== sendButton) {
        sendButton = bestButton;
        attachButtonListener(sendButton);
    }
});

observer.observe(document.body, { childList: true, subtree: true });
