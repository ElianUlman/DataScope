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
    console.log("sendData ejecutado con tipo:", type)
    chrome.runtime.sendMessage({ type: type, content: oldEditorContent });
}

function configEditor() {
    editor.addEventListener('input', (e) => {
        editorContent = e.target.textContent

        console.log("[INPUT] Editor detectó escritura. textContent:", editorContent)

        if (!sendButton) {
            cleanButtonCandidates()
            findButton(editor, 10)
            console.log("[INPUT] Candidatos encontrados:", sendButtonCandidates.size, Array.from(sendButtonCandidates))

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
        console.log("[KEYDOWN] Tecla presionada:", e.key, "| shiftKey:", e.shiftKey, "| textContent:", editor.textContent.trim())
        if (e.key === 'Enter' && !e.shiftKey && oldEditorContent?.trim() !== "") {
            console.log("[KEYDOWN] Enter detectado, llamando handleSend()")
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
            console.log("[findButton] Se llegó al body, dejando de subir.")
            break
        }

        const botones = ancestro.querySelectorAll('button, [role="button"]')

        botones.forEach((boton) => {
            attachListeners(boton)
            sendButtonCandidates.add(buttonToString(getDigitalPrint(boton)))
        })

        if (botones.length < 1) {
            console.log("[findButton] Nivel sin botones, subiendo. Elemento actual:", ancestro.tagName, ancestro.className)
        }

        ancestro = ancestro.parentElement;
    }
}

function sendbuttonSnapshot() {
    sendButtonSnapshot = new Set([...sendButtonCandidates])
    console.log("[SNAPSHOT] Snapshot tomado:", Array.from(sendButtonSnapshot))
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

    console.log("[checkButton] Snapshot:", Array.from(sendButtonSnapshot))
    console.log("[checkButton] Candidates actuales:", Array.from(sendButtonCandidates))

    sendButtonSnapshot.forEach((btn) => {
        if (!sendButtonCandidates.has(btn)) {
            botonDesaparecido = btn
        }
    })

    sendButtonQuery = botonDesaparecido
    console.log("[checkButton] Query encontrada:", sendButtonQuery)
}

const setEditor = (e) => {
    let candidate = e.target
    console.log("[setEditor] focusin en:", candidate.tagName, "| isContentEditable:", candidate.isContentEditable)

    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {
        if (candidate === editor) return

        editor = candidate
        listenersAttached = false
        configEditor()
        console.log("[setEditor] NUEVO EDITOR:", editor)
    }
}

const handleSend = () => {
    console.log("[handleSend] Iniciando. Candidates antes del snapshot:", Array.from(sendButtonCandidates))

    sendbuttonSnapshot()
    findButton(editor, 10)

    console.log("[handleSend] Candidates después de findButton:", Array.from(sendButtonCandidates))

    cleanButtonCandidates()

    setTimeout(() => {
        console.log("[handleSend setTimeout] editor.textContent:", JSON.stringify(editor.textContent))

        if (editor && editor.textContent === "") {
            console.log("[handleSend setTimeout] Editor vacío, procediendo a sendData")
            findButton(editor, 10)
            checkButton()
            sendData("USER_MESSAGE")
        } else {
            console.warn("[handleSend setTimeout] Editor NO está vacío, sendData no se ejecuta. Contenido:", JSON.stringify(editor.textContent))
        }
    }, 100)
}

const onMouseDown = (e) => {
    console.log("[onMouseDown] CLICK en:", e.target.tagName, e.target.className)
    handleSend()
}

document.addEventListener('focusin', setEditor)

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

observer.observe(document.body, {
    childList: true,
    subtree: true
})