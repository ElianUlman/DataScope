// FRONTEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "Prompt Enviado") {
        document.getElementById("mensaje").textContent = msg.data;
    }
});

// --- LOGIN ---
document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const COMPANY_NAME = document.getElementById("companyName").value;
    const COMPANY_PWD  = document.getElementById("pwd").value;

    const data = {
        companyName:     COMPANY_NAME,
        companyPassword: COMPANY_PWD
    };

    const response = await chrome.runtime.sendMessage({
        type:    "SEND_API",
        payload: data
    });

    console.log("Respuesta de la API:", response);
});

// --- REGISTRO ---
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
            console.log("Token recibido:", res.token);
            e.target.reset();
        } else {
            feedback.textContent = "Error: " + (res?.error || "sin respuesta");
            feedback.style.color = "#f44336";
            console.error("Error en registro:", res?.error);
        }
    });
});