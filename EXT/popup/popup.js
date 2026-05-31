// FRONTEND DE LA EXTENSION

document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const MAIL = document.getElementById("mail").value;
    const COMPANY_PWD = document.getElementById("pwd").value;

    const data = {
        password: COMPANY_PWD,
        email: MAIL
    };

    const response = await chrome.runtime.sendMessage({
        type: "LOGIN_API",
        payload: data
    });

    console.log("Respuesta de la API recibida en popup:", response);

    if (response && response.ok) {
        console.log("¡Login aprobado!");

        chrome.storage.local.set({ token: response.token }, () => {
            console.log("Token escrito con éxito.");
            verificarPantalla();
        });

    } else {
        const feedback = document.getElementById("reg-feedback");
        if (feedback) {
            feedback.textContent = "Error: " + (response?.error || "Credenciales incorrectas");
            feedback.style.color = "#f44336";
        }
    }
});

function verificarPantalla() {
    chrome.storage.local.get(["token"], (result) => {
        const seccionAuth = document.getElementById("sinSesion");
        const seccionPrincipal = document.getElementById("conSesion");

        if (result.token) {
            console.log("Vista activa: CON SESIÓN");
            if (seccionAuth) seccionAuth.style.display = "none";
            if (seccionPrincipal) seccionPrincipal.style.display = "block";
        } else {
            console.log("Vista activa: SIN SESIÓN");
            if (seccionAuth) seccionAuth.style.display = "block";
            if (seccionPrincipal) seccionPrincipal.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    verificarPantalla();
});

const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "LOGOUT" }, () => {
            console.log("Sesión eliminada.");
            verificarPantalla();
        });
    });
}

const privateModeBtn = document.getElementById("btn-privateMode");
const handlePrivateMode = async () => {

    const storage = await chrome.storage.local.get("user");
    const currentUserData = storage.user || {};
    const isPrivateModeActive = currentUserData.privateMode || false;

    const newPrivateModeState = !isPrivateModeActive;

    updateBtnText(newPrivateModeState)

    await chrome.storage.local.set({
        user: {
            ...currentUserData,
            privateMode: newPrivateModeState
        }
    });
};

function updateBtnText(privateMode){
    if(privateMode){
        privateModeBtn.innerText = "Desactivar modo privado";
    }else{
        privateModeBtn.innerText = "Activar modo privado";  
    }
}

async function initializeButtonText() {

    const storage = await chrome.storage.local.get("user");
    const isPrivateModeActive = storage.user?.privateMode || false;

    if (privateModeBtn) {
        
        updateBtnText(isPrivateModeActive)
        privateModeBtn.addEventListener("click", handlePrivateMode);
    }
}

document.querySelector('#conSesion a').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: e.currentTarget.href });
});

initializeButtonText();