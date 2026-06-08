import { isTokenValid, checkTabAccessPermission, getCurrentAi } from './auth.js'
import {
    findButton, cleanButtonCandidates, sendbuttonSnapshot,
    checkButton, findElementByFingerprint, checkSameElement,
    getSendButtonQuery
} from './buttonDetector.js'
import { setEditor, configEditor } from './editorDetector.js'

let oldEditorContent = ""
let sendButton = null
let isExtensionRunning = false
let isWaitingForSend = false

function sendData(type, content, currentPlatform) {
    console.log("[content] sendData — platform:", currentPlatform, "| content length:", content?.length, "| preview:", content?.slice(0, 60))
    try {
        if (!chrome.runtime?.id) {
            console.warn("[content] chrome.runtime.id no disponible, abortando")
            return
        }

        chrome.storage.local.get("currentModel", (result) => {
            const model = result.currentModel || "unknown";
            console.log("[content] modelo:", model, "— enviando a background")
            chrome.runtime.sendMessage({ type, content, currentPlatform, model }, (response) => {
                console.log("[content] respuesta de background:", response)
            });
        });

    } catch (err) {
        console.warn("[DataScope] Extension context invalidated:", err.message)
    }
}

const handleSend = () => {
    console.log("[handleSend] disparado | isWaitingForSend:", isWaitingForSend, "| oldEditorContent length:", oldEditorContent?.length, "| preview:", oldEditorContent?.slice(0, 60))
    if (isWaitingForSend) {
        console.log("[handleSend] bloqueado por isWaitingForSend")
        return
    }
    isWaitingForSend = true

    // Snapshot ANTES de que el DOM cambie por el envío
    console.log("[handleSend] llamando sendbuttonSnapshot")
    sendbuttonSnapshot()
    console.log("[handleSend] llamando findButton sobre currentEditor:", getCurrentEditor()?.tagName, getCurrentEditor()?.className?.slice(0, 40))
    findButton(getCurrentEditor(), 10, onMouseDown)
    console.log("[handleSend] llamando cleanButtonCandidates")
    cleanButtonCandidates()

    setTimeout(async () => {
        console.log("[handleSend] timeout — llamando findButton post-envío")
        isWaitingForSend = false
        findButton(getCurrentEditor(), 10, onMouseDown)
        console.log("[handleSend] llamando checkButton")
        checkButton()
        console.log("[handleSend] sendButtonQuery tras checkButton:", getSendButtonQuery())
        const currentAi = await getCurrentAi()
        console.log("[handleSend] currentAi:", currentAi)
        sendData("USER_MESSAGE", oldEditorContent, currentAi)
    }, 500)
}

const onMouseDown = () => {
    console.log("[onMouseDown] click detectado en candidato a botón")
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
                        console.log("[observer] botón re-aparecido (nodo directo):", node.tagName)
                        sendButton = node;
                    }
                    const childMatch = node.querySelector(`*`);
                    if (childMatch && childMatch.parentNode && checkSameElement(childMatch, sendButtonQuery)) {
                        console.log("[observer] botón re-aparecido (hijo):", childMatch.tagName)
                        sendButton = childMatch;
                    }
                }
            });
        }
    }
})

function initializeDataScopeExtension() {
    document.addEventListener('focusin', (e) => {
        setEditor(e, (editorElement) => {
            currentEditor = editorElement
            configEditor(
                editorElement,
                (text) => { oldEditorContent = text },
                (text) => {
                    console.log("[initializeDataScopeExtension] onEnter — text length:", text?.length, "| trim empty:", text?.trim() === "")
                    if (text?.trim() !== "") handleSend()
                }
            )
        })
    })

    observer.observe(document.body, { childList: true, subtree: true })
    console.log("[DataScope] Running core components in the DOM...");
}

async function runExtension() {
    const tokenValido = await isTokenValid();

    if (!tokenValido) {
        console.log("Sesión expirada o inexistente. Deteniendo extensión.");
        return false;
    }

    const storagePrivateMode = await chrome.storage.local.get("user");
    const isPrivateModeActive = storagePrivateMode.user?.privateMode || false;

    if (isPrivateModeActive) {
        console.log("El modo privado esta activado. La extension no esta monitoreando");
        return false;
    }

    await checkTabAccessPermission(initializeDataScopeExtension);
    return true;
}

async function tryStartExtension() {
    if (isExtensionRunning) return;
    const success = await runExtension();
    if (success) isExtensionRunning = true;
}

try {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && (changes.token || changes.user || changes.privateMode)) {
            console.log("[DataScope] Cambios detectados. Reintentando...");
            isExtensionRunning = false;
            tryStartExtension();
        }
    });
} catch (err) {
    console.warn("[DataScope] chrome.storage.onChanged no disponible:", err.message)
}

tryStartExtension();