//FRONTEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "Prompt Enviado") {
        document.getElementById("mensaje").textContent = msg.data;
    }
});

document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const COMPANY_NAME = document.getElementById("companyName").value;
    const COMPANY_PWD = document.getElementById("pwd").value;

    let data = {
        companyName: COMPANY_NAME,
        companyPassword: COMPANY_PWD
    }

    const response = await chrome.runtime.sendMessage({
        type: "SEND_API",
        payload: data
    });

    console.log("Respuesta de la API:", response);
});

document.getElementById("registro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById("regName").value,
        password: document.getElementById("regPwd").value
    };

    chrome.runtime.sendMessage({ type: "REGISTER_API", payload }, (res) => {
        if (res.ok) {
            console.log("empresa creada")
            e.target.reset();
        } else {
            console.log("Error: " + res.error, true);
        }
    });
});