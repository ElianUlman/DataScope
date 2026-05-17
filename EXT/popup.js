//FRONTEND DE LA EXTENSION

document.getElementById("sesion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const USER = document.getElementById("user").value;
    const COMPANY_PWD = document.getElementById("pwd").value;

    let data = {
        user: USER,
        companyPassword: COMPANY_PWD
    }

    const response = await chrome.runtime.sendMessage({
        type: "SEND_API",
        payload: data
    });

    console.log("Respuesta de la API:", response);

    // Guardar el token si el inicio de sesión es exitoso
    if (response && response.ok && response.data.token) {
        chrome.storage.local.set({ auth_token: response.data.token });
        console.log("TODO SALIO BIEEEEEEN")
    }
    else{
        console.log("TODO SALIO MAAAAAAAAL")
    }
});

/*
document.getElementById("registro").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://tu-sitio-web.com/registro" });
});
*/