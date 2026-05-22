// FRONTEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "Prompt Enviado") {
        document.getElementById("mensaje").textContent = msg.data;
    }
});

// --- LOGIN ---
document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedback = document.getElementById("login-feedback");

    const payload = {
        companyName:     document.getElementById("companyName").value,
        companyPassword: document.getElementById("pwd").value
    };

    try {
        const response = await chrome.runtime.sendMessage({ type: "SEND_API", payload });

        if (response && response.ok) {
            feedback.textContent = "Login exitoso";
            feedback.style.color = "#4caf50";
            console.log("Login exitoso. Token:", response.token);
        } else {
            feedback.textContent = "Error: " + (response?.error || "sin respuesta");
            feedback.style.color = "#f44336";
            console.error("Error en login:", response?.error);
        }
    } catch (err) {
        feedback.textContent = "Error de conexión";
        feedback.style.color = "#f44336";
        console.error("Error de conexión en login:", err.message);
    }
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
            console.log("Registro exitoso. Token:", res.token);
            e.target.reset();
        } else {
            feedback.textContent = "Error: " + (res?.error || "sin respuesta");
            feedback.style.color = "#f44336";
            console.error("Error en registro:", res?.error);
        }
    });
});