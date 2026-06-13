import { isTokenValid, checkTabAccessPermission, getCurrentAi } from './auth.js'
import {
    findButton, cleanButtonCandidates, sendbuttonSnapshot,
    checkButton, findElementByFingerprint, checkSameElement,
    getSendButtonQuery, getDigitalPrint, buttonToString
} from './buttonDetector.js'
import { setEditor, configEditor } from './editorDetector.js'

let oldEditorContent = ""
let sendButton = null
let isExtensionRunning = false
let isWaitingForSend = false
let loggedEditors = new Set()

function sendData(type, content, currentPlatform) {
    try {
        if (!chrome.runtime?.id) {
            console.warn("[EXT ERROR] chrome.runtime.id no disponible, contexto de extensión invalidado. Abortando envío.");
            return
        }

        chrome.storage.local.get("currentModel", (result) => {
            const model = result.currentModel || "unknown";
            chrome.runtime.sendMessage({ type, content, currentPlatform, model });
        });

    } catch (err) {
        console.error("[EXT CRITICAL ERROR] Contexto de extensión invalidado durante sendData:", err);
    }
}

const handleSend = () => {
    if (isWaitingForSend) {
        return
    }
    isWaitingForSend = true

    // Snapshot ANTES de que el DOM cambie por el envío
    sendbuttonSnapshot()
    findButton(getCurrentEditor(), 10, onMouseDown)
    cleanButtonCandidates()

    setTimeout(async () => {
        isWaitingForSend = false
        findButton(getCurrentEditor(), 10, onMouseDown)
        checkButton()
        const currentAi = await getCurrentAi()
        sendData("USER_MESSAGE", oldEditorContent, currentAi)
    }, 500)
}

const onMouseDown = () => {
    handleSend()
}

let currentEditor = null
function getCurrentEditor() { return currentEditor }

const observer = new MutationObserver((mutationList) => {
    const sendButtonQuery = getSendButtonQuery()
    if (sendButtonQuery) {
        for (const mutation of mutationList) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (!node.parentNode) return
                    if (checkSameElement(node, sendButtonQuery)) {
                        sendButton = node;
                    }
                    const childMatch = node.querySelector(`*`);
                    if (childMatch && childMatch.parentNode && checkSameElement(childMatch, sendButtonQuery)) {
                        sendButton = childMatch;
                    }
                }
            });
        }
    }
})

function initializeDataScopeExtension() {
    console.log("[EXT INIT] Inicializando listeners de Data Scope en el DOM...");
    document.addEventListener('focusin', (e) => {
        setEditor(e, (editorElement) => {
            const editorPrint = buttonToString(getDigitalPrint(editorElement));
            
            if (!loggedEditors.has(editorPrint)) {
                console.log("[EXT NUEVO EDITOR] Se detectó un nuevo editor de texto:", editorElement);
                loggedEditors.add(editorPrint);
            }

            if (currentEditor !== editorElement) {
                currentEditor = editorElement
                configEditor(
                    editorElement,
                    (text) => { oldEditorContent = text },
                    (text) => {
                        if (text?.trim() !== "") handleSend()
                    }
                )
            }
        })
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

async function runExtension() {
    console.log("[EXT START] Iniciando comprobaciones para ejecutar la extensión...");
    const tokenValido = await isTokenValid();
    console.log(`[EXT START] Estado del token: ${tokenValido}`);

    if (!tokenValido) {
        console.log("[EXT START] Ejecución abortada: Token inválido o sin sesión.");
        return false;
    }

    const storagePrivateMode = await chrome.storage.local.get("user");
    const isPrivateModeActive = storagePrivateMode.user?.privateMode || false;
    console.log(`[EXT START] Estado del modo privado: ${isPrivateModeActive}`);

    if (isPrivateModeActive) {
        console.log("[EXT START] Ejecución abortada: Modo privado activado.");
        return false;
    }

    await checkTabAccessPermission(initializeDataScopeExtension);
    console.log("[EXT START] Comprobaciones finalizadas.");
    return true;
}

async function tryStartExtension() {
    console.log(`[EXT START] tryStartExtension llamado. isExtensionRunning: ${isExtensionRunning}`);
    if (isExtensionRunning) return;
    const success = await runExtension();
    if (success) isExtensionRunning = true;
}

try {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && (changes.token || changes.user || changes.privateMode)) {
            isExtensionRunning = false;
            tryStartExtension();
        }
    });
} catch (err) {
    console.error("[EXT ERROR] chrome.storage.onChanged falló al inicializarse:", err);
}

tryStartExtension();