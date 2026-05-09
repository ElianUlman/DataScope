//BACKEND DE LA EXTENSION
const autorizacionFijada = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJNaWNoYWVsU2NvdHQiLCJpYXQiOjE3NzgzMzUwMDksImV4cCI6MTc3ODMzODYwOX0.rVMrl9NzfB63093MDk0WbNph_DxuieAGik7IRtyVCQY"

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if(msg.type === "USER_MESSAGE"){
        //http://127.0.0.1:3000/api/message necesita un authorization, que ya que todavia la EXTENSION
        //no tiene un login bien hecho, va a estar fijado (y ya que la token expira, para que esta mierdita
        //funcione bien, hace falta conseguir una nueva token llamando a /api/login)

        fetch("http://127.0.0.1:3000/api/message/", {
            method: "POST",
            
            headers: { "Content-Type": "application/json", "Authorization": autorizacionFijada},
            body: JSON.stringify({ 
                content: msg.content,
                sender: "user"

             })
        })
        .then(res => res.text())
        .then(data => console.log("Respuesta de la API:", data))
        .catch(err => console.log("Error al conectar con la API:", err.message));
    }
    return true;
    
}); 