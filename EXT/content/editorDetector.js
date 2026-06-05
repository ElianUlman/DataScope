export let editor = null

export function setEditor(e, configEditorCallback) {
    let candidate = e.target

    console.log("[setEditor] focusin en:", candidate.tagName, "| isContentEditable:", candidate.isContentEditable, "| clase:", candidate.className?.slice(0, 60))

    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {
        if (candidate === editor) {
            console.log("[setEditor] mismo editor, ignorando")
            return
        }

        editor = candidate
        console.log("[setEditor] NUEVO EDITOR asignado:", editor.tagName, editor.className?.slice(0, 60))
        configEditorCallback(editor)
    } else {
        console.log("[setEditor] target ignorado — no es editable ni TEXTAREA")
    }
}

export function configEditor(editorElement, onInputCallback, onEnterCallback) {
    console.log("[configEditor] adjuntando listeners a:", editorElement.tagName, editorElement.className?.slice(0, 60))

    editorElement.addEventListener('input', (e) => {
        const text = e.target.textContent
        console.log("[configEditor] input — textContent length:", text.length, "| preview:", text.slice(0, 60))
        onInputCallback(text)
    })

    editorElement.addEventListener("keydown", (e) => {
        console.log("[configEditor] keydown — key:", e.key, "| shiftKey:", e.shiftKey, "| textContent length:", e.target.textContent?.length)
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log("[configEditor] Enter sin Shift detectado — disparando onEnterCallback")
            onEnterCallback(e.target.textContent)
        }
    })
}