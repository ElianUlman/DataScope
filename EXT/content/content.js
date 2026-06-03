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

function sendData(type, content, currentPlatform) {
    console.log(type, content, currentPlatform)
    try {
        if (!chrome.runtime?.id) return

        chrome.storage.local.get("currentModel", (result) => {
            const model = result.currentModel || "unknown";
            chrome.runtime.sendMessage({ type, content, currentPlatform, model });
        });

    } catch (err) {
        console.warn("[DataScope] Extension context invalidated:", err.message)
    }
}

const handleSend = () => {
    console.log("[handleSend] disparado")

    sendbuttonSnapshot()
    findButton(getCurrentEditor(), 10, onMouseDown)
    cleanButtonCandidates()

    setTimeout(async () => {
        const contenido = getCurrentEditor()?.textContent?.trim()
        console.log("[DS] contenido después de send:", JSON.stringify(contenido))
        if (getCurrentEditor() && contenido === "") {
            findButton(getCurrentEditor(), 10, onMouseDown)
            checkButton()
            const currentAi = await getCurrentAi()
            sendData("USER_MESSAGE", oldEditorContent, currentAi)
        }
    }, 500)
}

const onMouseDown = () => handleSend()

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
                (text) => { oldEditorContent = text },  // onInput
                (text) => {                               // onEnter
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

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && (changes.token || changes.user || changes.privateMode)) {
        console.log("[DataScope] Cambios detectados. Reintentando...");
        isExtensionRunning = false;
        tryStartExtension();
    }
});

tryStartExtension();