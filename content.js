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
        editor: 'textarea',
        boton: 'button[id="send-button"]'
    }
};

function guardarDatos(texto) {
    const limpio = texto.trim();

    if (limpio !== "" && limpio !== ultimoTextoProcesado) {
        ultimoTextoProcesado = limpio;

        const DATOS = { tipo: "PROMPT", contenido: limpio };
        chrome.runtime.sendMessage(DATOS, (res) => {
            if (chrome.runtime.lastError) {
                console.warn("Error enviando:", chrome.runtime.lastError.message);
            }
        });
    }
}

function obtenerConfiguracionActual() {
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

const configActual = obtenerConfiguracionActual();
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

        const btn = e.target.closest(configActual.boton);
        if (btn) {
            const contenido = editor.innerText || editor.value;
            console.log("Botón presionado. Contenido:", contenido);
            guardarDatos(contenido);
        }
    }, true);

    const observer = new MutationObserver(() => {

        if (location.href !== ultimaUrl && !editor) {
            editor.removeEventListener('keydown', manejarTeclado)
            console.log("cambio la url")
            ultimaUrl = location.href;
            editor = null;
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