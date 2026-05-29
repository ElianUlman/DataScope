let sendButtonCandidates = new Set()
let sendButtonSnapshot
let sendButtonQuery
let listenersAttached = false

export function getSendButtonQuery() { return sendButtonQuery }
export function getSendButtonCandidates() { return sendButtonCandidates }

export function getDigitalPrint(e) {
    return {
        tag: e.tagName || "",
        clases: Array.from(e.classList).join('.') || "",
        position: e.parentNode ? Array.from(e.parentNode.children).indexOf(e) ?? -1 : -1,
        father: e.closest('[id]') ? e.closest('[id]').id : null
    };
}

export function checkSameElement(element, originalPrint) {
    if (!element || !originalPrint) return false
    const currentPrint = getDigitalPrint(element)

    return currentPrint.tag === originalPrint.tag &&
        currentPrint.clases === originalPrint.clases &&
        currentPrint.position === originalPrint.position &&
        currentPrint.father === originalPrint.father;
}

export function buttonToString(datosBoton) {
    return `${datosBoton.tag}|${datosBoton.clases}|${datosBoton.position}|${datosBoton.father}`
}

export function attachListeners(e, onClickCallback) {
    e.addEventListener('click', onClickCallback)
}

export function cleanButtonCandidates() {
    sendButtonCandidates.clear()
}

export function findButton(start, levels, onClickCallback) {
    let ancestro = start;

    for (let i = 0; i < levels; i++) {
        if (!ancestro || ancestro === document.body) break

        const botones = ancestro.querySelectorAll('button, [role="button"]')
        botones.forEach((boton) => {
            attachListeners(boton, onClickCallback)
            sendButtonCandidates.add(buttonToString(getDigitalPrint(boton)))
        })

        ancestro = ancestro.parentElement;
    }
}

export function sendbuttonSnapshot() {
    sendButtonSnapshot = new Set([...sendButtonCandidates])
}

export function checkButton() {
    let botonDesaparecido;

    sendButtonSnapshot.forEach((btn) => {
        if (!sendButtonCandidates.has(btn)) {
            botonDesaparecido = btn
        }
    })

    sendButtonQuery = botonDesaparecido
}

export function findElementByFingerprint(fingerprint) {
    const parts = fingerprint.split('|')
    const [tag, clases, position, father] = parts

    const todosLosElementos = document.querySelectorAll(tag)
    let mejorElemento = null
    let mejorPuntaje = 0

    for (const elemento of todosLosElementos) {
        if (!elemento.parentNode) continue

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