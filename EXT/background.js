//BACKEND DE LA EXTENSION

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if(msg.type === "USER_MESSAGE"){
        fetch("http://127.0.0.1:3000/api/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: msg.content })
        })
        .then(res => res.text())
        .then(data => console.log("Respuesta de la API:", data))
        .catch(err => console.log("Error al conectar con la API:", err.message));
    }
    return true;
    
}); 