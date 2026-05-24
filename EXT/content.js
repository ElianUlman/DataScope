let editor
let editorQuery
let editorContent
let oldEditorContent

let sendButton
let sendButtonCandidates = new Set
let sendButtonSnapshot;
let sendButtonQuery
let listenersAttached = false

function sendData(type) {
    chrome.runtime.sendMessage({ type: type, content: oldEditorContent });
}

function configEditor() {
    editor.addEventListener('input', (e) => {
        editorContent = e.target.textContent

        if (!sendButton) {
            cleanButtonCandidates()
            findButton(editor, 10)

            if (sendButtonCandidates.size > 0 && !listenersAttached) {
                listenersAttached = true
            }
        }

        if (!sendButton && sendButtonQuery) {
            sendButton = findElementByFingerprint(sendButtonQuery)
            console.log("[INPUT] sendButton resuelto por fingerprint:", sendButton)
        }

        oldEditorContent = editorContent
    })

    editor.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' && !e.shiftKey && oldEditorContent?.trim() !== "") {
            handleSend()
        }
    })
}

function getDigitalPrint(e) {
    return {
        tag: e.tagName || "",
        clases: Array.from(e.classList).join('.') || "",
        position: Array.from(e.parentNode.children).indexOf(e) ?? -1,
        father: e.closest('[id]') ? e.closest('[id]').id : null
    };
}

function checkSameElement(element, originalPrint) {
    if (!element || !originalPrint) return false
    const currentPrint = getDigitalPrint(element)

    return currentPrint.tag === originalPrint.tag &&
        currentPrint.clases === originalPrint.clases &&
        currentPrint.position === originalPrint.position &&
        currentPrint.father === originalPrint.father;
}

function attachListeners(e) {
    e.addEventListener('click', onMouseDown)
}

function cleanButtonCandidates() {
    sendButtonCandidates.clear()
}

function findButton(start, levels) {
    let ancestro = start;

    for (let i = 0; i < levels; i++) {
        if (!ancestro || ancestro === document.body) {
            break
        }

        const botones = ancestro.querySelectorAll('button, [role="button"]')

        botones.forEach((boton) => {
            attachListeners(boton)
            sendButtonCandidates.add(buttonToString(getDigitalPrint(boton)))
        })

        if (botones.length < 1) {
        }

        ancestro = ancestro.parentElement;
    }
}

function sendbuttonSnapshot() {
    sendButtonSnapshot = new Set([...sendButtonCandidates])
}

function buttonToString(datosBoton) {
    return `${datosBoton.tag}|${datosBoton.clases}|${datosBoton.position}|${datosBoton.father}`
}

function findElementByFingerprint(fingerprint) {
    const parts = fingerprint.split('|')
    const [tag, clases, position, father] = parts

    const todosLosElementos = document.querySelectorAll(tag)
    let mejorElemento = null
    let mejorPuntaje = 0

    for (const elemento of todosLosElementos) {
        let puntaje = 0

        if (elemento.closest('[id]')?.id === father) puntaje += 3
        if (Array.from(elemento.parentNode.children).indexOf(elemento) === parseInt(position)) puntaje += 2

        const clasesElemento = Array.from(elemento.classList)
        const clasesFingerprint = clases.split('.')
        const clasesComunes = clasesElemento.filter(c => clasesFingerprint.includes(c))
        puntaje += clasesComunes.length

        if (puntaje > mejorPuntaje) {
            mejorPuntaje = puntaje
            mejorElemento = elemento
        }
    }

    return mejorElemento
}

function checkButton() {
    let botonDesaparecido;

    sendButtonSnapshot.forEach((btn) => {
        if (!sendButtonCandidates.has(btn)) {
            botonDesaparecido = btn
        }
    })

    sendButtonQuery = botonDesaparecido
}

const setEditor = (e) => {
    let candidate = e.target

    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {
        if (candidate === editor) return

        editor = candidate
        listenersAttached = false
        configEditor()
        console.log("[setEditor] NUEVO EDITOR:", editor)
    }
}

const handleSend = () => {

    console.log("[handleSend] disparado, contenido:", editor?.textContent)

    sendbuttonSnapshot()
    findButton(editor, 10)

    cleanButtonCandidates()

    setTimeout(() => {

        if (editor && editor.textContent === "") {
            console.log("[handleSend] Luego de esperar:", editor?.textContent)
            findButton(editor, 10)
            checkButton()
            sendData("USER_MESSAGE")
        }
    }, 100)
}

const onMouseDown = (e) => {
    handleSend()
}

const observer = new MutationObserver((mutationList) => {
    if (sendButtonQuery) {
        for (const mutation of mutationList) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (checkSameElement(node, sendButtonQuery)) {
                        sendButton = node;
                        console.log("[MutationObserver] Nuevo botón de envío encontrado:", sendButton);
                    }
                    const childMatch = node.querySelector(`*`);
                    if (childMatch && checkSameElement(childMatch, sendButtonQuery)) {
                        sendButton = childMatch;
                    }
                }
            });
        }
    }
})

async function checkTabAccessPermission() {
    const currentUrl = window.location.href.toLowerCase();

    const storage = await chrome.storage.local.get("user");
    const allowedAis = storage.user?.allowedAis || [];

    console.log("[DataScope] Current URL:", currentUrl);
    console.log("[DataScope] Allowed AIs from user profile:", allowedAis);

    let currentAi = null;
    const isAllowed = allowedAis.some((aiName) => {
        const cleanAiName = aiName.toLowerCase().trim();
        const IS_CURRENT = currentUrl.includes(cleanAiName);
        if (IS_CURRENT) currentAi = cleanAiName;
        return IS_CURRENT;
    });

    if (currentAi) {
        await chrome.storage.local.set({ currentAi })
    }

    if (!isAllowed) {
        console.warn(`[DataScope] Extension disabled. This AI is not allowed in your settings.`);
        return;
    }

    console.log(`[DataScope] AI authorized! Initializing extension features...`);
    initializeDataScopeExtension();
}

async function isTokenValid() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"]);

    if (!storage.token || !storage.expiresAt) {
        console.log("El token no existe o ha expirado.")
        return false;
    }

    const currentTime = Date.now();
    if (currentTime > storage.expiresAt) {
        console.warn("[DataScope] El token ha expirado.");

        await chrome.storage.local.remove(["token", "expiresAt", "user"]);
        return false;
    }

    return true;
}

function initializeDataScopeExtension() {
    document.addEventListener('focusin', setEditor);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("[DataScope] Running core components in the DOM...");
}

async function runExtension() {
    let exitCode = true;

    const tokenValido = await isTokenValid();

    if (!tokenValido) {
        console.log("Sesión expirada o inexistente. Deteniendo extensión.");
        exitCode = false;
    }
    else {
        const storagePrivateMode = await chrome.storage.local.get("user");
        const isPrivateModeActive = storagePrivateMode.user?.privateMode || false;

        if (isPrivateModeActive === false) {
            checkTabAccessPermission();
        } else {
            console.log("El modo privado esta activado. La extension no esta monitoreando");
            exitCode = false;
        }

    }

    return exitCode
}

let isExtensionRunning = false;

async function tryStartExtension() {
    if (isExtensionRunning) return;

    const success = await runExtension();
    if (success) {
        isExtensionRunning = true;
    }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {

        if (changes.token || changes.user || changes.privateMode) {
            console.log("[DataScope] Se detectaron cambios en las credenciales locales. Reintentando...");
            isExtensionRunning = false;
            tryStartExtension();
        }
    }
});

tryStartExtension();