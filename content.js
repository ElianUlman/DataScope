const TARGET_EDITOR = 'div[id="prompt-textarea"]';
const TARGET_BOTON_ENVIAR = 'button[data-testid="send-button"]';

let editor;
let ultimaUrl = location.href;

document.addEventListener('click', (e) => {

    const btn = e.target.closest(TARGET_BOTON_ENVIAR);
    if (btn) {
        console.log("Botón de enviar presionado. Contenido:", editor.innerText);
        guardarDatos(editor.innerText);
    }

}, true);

function configurarEditor(elemento) {

    elemento.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {
            console.log("Enter detectado. Contenido:", e.currentTarget.innerText);
            guardarDatos(e.currentTarget.innerText);
        }
    });
}

function guardarDatos(texto) {
    const DATOS = {
        tipo: "PROMPT",
        contenido: texto
    }

    if (texto.trim() !== "") {
        console.log("Guardando:", texto);

        chrome.runtime.sendMessage(DATOS, (Respuesta) => {

            if (chrome.runtime.lastError) {
                console.log("Error o nadie escuchando:", chrome.runtime.lastError.message);
            } else {
                console.log("Respuesta del receptor:", Respuesta.status);
            }
        })
    }
}

const observer = new MutationObserver(() => {

    if (location.href !== ultimaUrl && !editor) {
        console.log("cambio la url")
        ultimaUrl = location.href;
        editor = null;
    }

    const element = document.querySelector(TARGET_EDITOR);

    if (element && editor !== element) {
        console.log("¡Nuevo elemento encontrado!", element);
        editor = element;
        configurarEditor(editor);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});