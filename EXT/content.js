/*

- Guardar solo snapshots de los botones
- Detectar cuando hay un click y el editor queda vacio. Hacer una snapshot
- volver a buscar botones
- comparar cuales no estan

*/

let editor
let editorQuery
let editorContent
let oldEditorContent

let sendButton
let sendButtonCandidates = new Set
let sendButtonSnapshot;
let sendButtonQuery
let listenersAttached = false
let messageNumber = 0

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
        ariaLabel: e.getAttribute('aria-label') || "",
        dataTestId: e.dataset.testid || "",  // minúscula
        position: Array.from(e.parentNode.children).indexOf(e) ?? -1,
        father: e.closest('[id]') ? e.closest('[id]').id : null
    };
}

function checkSameElement(element, originalPrint) {
    if (!element || !originalPrint) return false
    const currentPrint = getDigitalPrint(element)

    const ariaLabelMatch = originalPrint.ariaLabel && currentPrint.ariaLabel === originalPrint.ariaLabel
    const dataTestIdMatch = originalPrint.dataTestId && currentPrint.dataTestId === originalPrint.dataTestId

    if (ariaLabelMatch || dataTestIdMatch) return true

    return currentPrint.tag === originalPrint.tag &&
        currentPrint.position === originalPrint.position &&
        currentPrint.father === originalPrint.father
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

        // busca tanto <button> como elementos con role="button"
        const botones = ancestro.querySelectorAll('button, [role="button"]')

        botones.forEach((boton) => {
            attachListeners(boton)
            sendButtonCandidates.add(botonAClave(getDigitalPrint(boton)))
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

function botonAClave(datosBoton) {
    return `${datosBoton.tag}|${datosBoton.ariaLabel}|${datosBoton.dataTestId}|${datosBoton.position}|${datosBoton.father}`
}

function findElementByFingerprint(fingerprint) {
    const parts = fingerprint.split('|')
    const [tag, ariaLabel, dataTestId, position, father] = parts

    const todosLosElementos = document.querySelectorAll(tag)
    let mejorElemento = null
    let mejorPuntaje = 0

    for (const elemento of todosLosElementos) {
        let puntaje = 0

        if (ariaLabel && elemento.getAttribute('aria-label') === ariaLabel) puntaje += 5
        if (dataTestId && elemento.dataset.testid === dataTestId) puntaje += 5
        if (elemento.closest('[id]')?.id === father) puntaje += 3
        if (Array.from(elemento.parentNode.children).indexOf(elemento) === parseInt(position)) puntaje += 2

        if (puntaje > mejorPuntaje) {
            mejorPuntaje = puntaje
            mejorElemento = elemento
        }
    }

    return mejorPuntaje >= 3 ? mejorElemento : null
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

        // si es el mismo editor, no hacer nada
        if (candidate === editor) return

        editor = candidate
        listenersAttached = false  // resetear para que vuelva a buscar botones
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
            findButton(editor, 10)
            checkButton()
            console.log(sendButtonCandidates)
        }
    }, 100)

    messageNumber += 1
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