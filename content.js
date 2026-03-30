const CONFIG_SITIOS = {
    'chatgpt.com': {
        editor: 'div[id="prompt-textarea"]',
        boton: 'button[data-testid="send-button"]'
    },
    'gemini.google.com': {
        editor: 'div[role="textbox"]',
        boton: 'button[aria-label*="Enviar"], .send-button'
    },
    'copilot.microsoft.com': {
        editor: '#userInput', 
        boton: 'button[data-testid="submit-button"], button[aria-label*="Submit"]'
    }
};

function guardarDatos(texto) {
    const TextoLimpio = texto.trim();

    if (TextoLimpio !== "" && TextoLimpio !== ultimoTextoProcesado) {
        ultimoTextoProcesado = TextoLimpio;

        const DATOS = { tipo: "PROMPT", contenido: TextoLimpio };
        chrome.runtime.sendMessage(DATOS, (res) => {
            if (chrome.runtime.lastError) {
                console.warn("Error enviando:", chrome.runtime.lastError.message);
            }
        });
    }
}

function obtenerConfiguracion() {
    const host = window.location.hostname;
    let config = null

    for (const dominio in CONFIG_SITIOS) {
        if (host.includes(dominio)) {
            config = CONFIG_SITIOS[dominio];
        }
    }

    return config;
}

function manejarTeclado(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const contenido = e.currentTarget.innerText || e.currentTarget.value;
        console.log("Enter detectado. Contenido:", contenido);
        guardarDatos(contenido);
    }
}

const configActual = obtenerConfiguracion();
let editor;
let ultimaUrl = location.href;
let ultimoTextoProcesado = "";


function configurarEditor(elemento) {
    if (elemento.getAttribute('data-extension-configurado') !== 'true') {
        elemento.addEventListener('keydown', manejarTeclado);
        elemento.setAttribute('data-extension-configurado', 'true');
        console.log("Listener vinculado exitosamente");
    }
}

if (configActual) {

    document.addEventListener('click', (e) => {

        const botonEnviar = e.target.closest(configActual.boton);
        if (botonEnviar) {
            const contenido = editor.innerText || editor.value;
            console.log("Botón presionado. Contenido:", contenido);
            guardarDatos(contenido);
        }
    }, true);

    const observer = new MutationObserver(() => {

        if (location.href !== ultimaUrl && !editor) {
            console.log("cambio la url")
            ultimaUrl = location.href;
            if (editor) {
                editor.removeEventListener('keydown', manejarTeclado);
                editor = null;
            }
        }

        const element = document.querySelector(configActual.editor);

        if (element && editor !== element) {
            console.log("¡Nuevo elemento encontrado!", element);
            editor = element;
            configurarEditor(editor);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}