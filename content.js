const TARGET_EDITOR = 'div[id="prompt-textarea"]';
const TARGET_BOTON_ENVIAR = 'button[data-testid="send-button"]';

let editor;

function setupButtonListener() {

    document.addEventListener('click', (e) => {

        const btn = e.target.closest(TARGET_BOTON_ENVIAR);
        if (btn) {
            console.log("Botón de enviar presionado. Contenido:", editor.innerText);
            guardarDatos(editor.innerText);
        }

    }, true);

    editor.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {
            console.log("Enter detectado. Contenido:", editor.innerText);
            guardarDatos(editor.innerText);
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

const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(TARGET_EDITOR);

    if (element) {
        console.log("¡Elemento encontrado!", element);

        editor = element

        setupButtonListener();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("LA EXTENSION ESTUVO ACA")