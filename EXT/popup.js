// FRONTEND DE LA EXTENSION

document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const MAIL = document.getElementById("mail").value;
    const COMPANY_PWD  = document.getElementById("pwd").value;

    const data = {
        password: COMPANY_PWD,
        email: MAIL
    };

    const response = await chrome.runtime.sendMessage({
        type:    "LOGIN_API",
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
            if(seccionAuth) seccionAuth.style.display = "none";      
            if(seccionPrincipal) seccionPrincipal.style.display = "block"; 
        } else {
            console.log("Vista activa: SIN SESIÓN");
            if(seccionAuth) seccionAuth.style.display = "block";     
            if(seccionPrincipal) seccionPrincipal.style.display = "none";  
        }
    });
}

// 1. Al abrir la extensión, chequeamos el estado
document.addEventListener("DOMContentLoaded", () => {
    verificarPantalla();
});

//logout
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        chrome.storage.local.remove(["token"], () => {
            console.log("Sesión eliminada.");
            verificarPantalla(); 
        });
    });
}

/* 
document.getElementById("registro").addEventListener("submit", (e) => {
    e.preventDefault();

    const feedback = document.getElementById("reg-feedback");

    const payload = {
        name:     document.getElementById("regName").value,
        email:    document.getElementById("regEmail").value,
        password: document.getElementById("regPwd").value
    };

    chrome.runtime.sendMessage({ type: "REGISTER_API", payload }, (res) => {
        if (res && res.ok) {
            feedback.textContent = "Usuario creado correctamente";
            feedback.style.color = "#4caf50";
            console.log("Registro exitoso. Token:", res.token);
            e.target.reset();
        } else {
            feedback.textContent = "Error: " + (res?.error || "sin respuesta");
            feedback.style.color = "#f44336";
            console.error("Error en registro:", res?.error);
        }
    });
});
*/