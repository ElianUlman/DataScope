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

        console.log("INPUT detectado. Estado actual:", {
            sendButton: sendButton,
            listenersAttached: listenersAttached,
            sendButtonQuery: sendButtonQuery,
            candidatesSize: sendButtonCandidates.size
        })

        if (!sendButton) {
            console.log("chequeando botones")
            cleanButtonCandidates()
            findButton(editor, 10)

            if (sendButtonCandidates.size > 0 && !listenersAttached) {
                listenersAttached = true
                console.log("Listeners adjuntados, botones encontrados:", sendButtonCandidates.size)
                console.log("Candidatos:", Array.from(sendButtonCandidates))
            }
        }

        console.log("Antes de buscar boton. sendButtonQuery vale:", sendButtonQuery, "sendButton vale:", sendButton)

        if (!sendButton && sendButtonQuery) {
            console.log("Intentando encontrar boton con query:", sendButtonQuery)
            sendButton = findElementByFingerprint(sendButtonQuery)
            console.log("BOTON DE ENVIAR ENCONTRADO:", sendButton)
        }

        oldEditorContent = editorContent
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
    console.log('Event listener listo')

}

function cleanButtonCandidates() {
    sendButtonCandidates.clear()
}

function findButton(start, levels) {

    let ancestro = start;

    for (let i = 0; i < levels; i++) {
        if (!ancestro || ancestro === document.body) {
            console.log("Se llegó al body, dejando de subir.")
            break
        }

        const botones = ancestro.querySelectorAll('button, [role="button"]')

        botones.forEach((boton) => {
            attachListeners(boton)
            sendButtonCandidates.add(buttonToString(getDigitalPrint(boton)))
        })

        if (botones.length < 1) {
            console.log("Este nivel no tiene botones, subiendo un nivel.")
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
    console.log("Query encontrada:", sendButtonQuery)
}

console.log(sendButtonCandidates)


const setEditor = (e) => {
    let candidate = e.target
    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {

        if (candidate === editor) return

        editor = candidate
        listenersAttached = false
        configEditor()
        console.log("NUEVO EDITOR: ", editor)
    }
}

const onMouseDown = (e) => {

    sendbuttonSnapshot()
    let buttonCandidate = e.target

    if (buttonCandidate.tagName != 'BUTTON') {
        findButton(buttonCandidate, 10)
        buttonCandidate = Array.from(sendButtonCandidates)[0]
    }

    console.log("CLICK DETECTADO EN: ", buttonCandidate)
    console.log(sendButtonCandidates)

    cleanButtonCandidates()
    setTimeout(() => {
        if (editor && editor.textContent === "") {
            console.log("llamando sendData")
            findButton(editor, 10)
            checkButton()
            console.log(sendButtonCandidates)
            sendData("USER_MESSAGE")
        }
    }, 100)
}

document.addEventListener('focusin', setEditor)

const observer = new MutationObserver((mutationList) => {

    if (sendButtonQuery) {
        for (const mutation of mutationList) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (checkSameElement(node, sendButtonQuery)) {
                        sendButton = node;
                        console.log("NUEVO BOTON DE ENVIO:", sendButton);
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