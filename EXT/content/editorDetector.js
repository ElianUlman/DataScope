export let editor = null

export function setEditor(e, configEditorCallback) {
    let candidate = e.target

    if (candidate.isContentEditable || candidate.tagName === 'TEXTAREA') {
        if (candidate === editor) return

        editor = candidate
        configEditorCallback(editor)
        console.log("[setEditor] NUEVO EDITOR:", editor)
    }
}

export function configEditor(editorElement, onInputCallback, onEnterCallback) {
    editorElement.addEventListener('input', (e) => {
        onInputCallback(e.target.textContent)
    })

    editorElement.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            onEnterCallback(e.target.textContent)
        }
    })
}