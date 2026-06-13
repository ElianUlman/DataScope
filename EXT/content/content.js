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
    document.addEventListener('focusin', (e) => {
        setEditor(e, (editorElement) => {
            currentEditor = editorElement
            configEditor(
                editorElement,
                (text) => { oldEditorContent = text },
                (text) => {
                    if (text?.trim() !== "") handleSend()
                }
            )
        })
    })

    observer.observe(document.body, { childList: true, subtree: true })
}

async function runExtension() {
    const tokenValido = await isTokenValid();

    if (!tokenValido) {
        return false;
    }

    const storagePrivateMode = await chrome.storage.local.get("user");
    const isPrivateModeActive = storagePrivateMode.user?.privateMode || false;

    if (isPrivateModeActive) {
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
            isExtensionRunning = false;
            tryStartExtension();
        }
    });
} catch (err) {
    console.error("[EXT ERROR] chrome.storage.onChanged falló al inicializarse:", err);
}

tryStartExtension();