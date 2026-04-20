let editor
let editorQuery
let editorContent
let oldEditorContent

let sendButton
let sendButtonQuery

function configEditor() {
    editor.addEventListener('input', (e) => {
        editorContent = e.target.textContent
        oldEditorContent = editorContent
    })
}

function getDigitalPrint(e) {
    return {
        tag: e.tagName || "",
        clases: Array.from(e.classList).join('.') || "",
        position: Array.from(e.parentNode.children).indexOf(e) || "",
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

function findButton(element) {
    let node = element
    let button
    let buttonFound = false

    while (node && !buttonFound) {
        if (node.tagName === 'BUTTON') {
            button = node
            buttonFound = true
        }
        else {
            node = node.parentElement
        }
    }

    return button
}


const setEditor = (e) => {

    let candidate = e.target
    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {
        editor = candidate
        configEditor()
        console.log("NUEVO EDITOR: ", editor)

        document.removeEventListener('focusin', setEditor)

    }
}

const setSendButton = (e) => {

    let lastClick = e.target;
    const nearButton = findButton(lastClick)

    console.log("CLICK DETECTADO EN: ", lastClick)
    console.log("BOTON CERCANO: ", nearButton)


    setTimeout(() => {
        if (editor && editor.textContent === "" && nearButton) {
            sendButton = nearButton
            sendButtonQuery = getDigitalPrint(sendButton)
            console.log("BOTÓN DETECTADO:", sendButtonQuery)
            document.removeEventListener('click', setSendButton)
        }
    }, 100)
}

document.addEventListener('focusin', setEditor)
document.addEventListener('click', setSendButton, { capture: true })
document.addEventListener('click', (e) => {
    console.log("RAW CLICK:", e.target)
}, { capture: true })

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