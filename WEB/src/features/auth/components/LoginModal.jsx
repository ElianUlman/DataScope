import "./LoginModal.css";
import { Eye, AtSign } from "lucide-react";
import { useState } from 'react'
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose, onOpenRegister }) {
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [rememberMe, setRememberMe] = useState(false)

  const [message, setMessage] = useState()
  const { login } = useAuth()

  const handleSubmit = async () => {
    setMessage("")
    const result = await login(email, password, rememberMe)

    if(result == true){
      onClose()
    }else{
      setMessage("Email o contraseña incorrectos")
    }

  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="login-modal">
        <button className="login-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        <h1>INICIO DE SESION</h1>

        <div className="input-group">
          <label>EMAIL ADDRESS</label>

          <div className="input-icon">
            <input type="email" placeholder="nombre@usuario.com" onChange={(e) => setEmail(e.target.value)} />
            <AtSign size={18} className="icon" />
          </div>
        </div>

        <div className="input-group">
          <label>PASSWORD</label>

          <div className="input-icon">
            <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
            <Eye size={18} className="icon" />
          </div>
        </div>

        <div className="remember">
          <input type="checkbox" onChange={(e) => setRememberMe(e.target.checked)}/>
          <span>Recordar mi cuenta</span>
        </div>

        <p className="error-text">{message}</p>

        <button className="login-btn" onClick={() => handleSubmit()}>Iniciar</button>

        <p className="bottom-text">
          ¿No tenes una cuenta? <span onClick={() => { onOpenRegister(); onClose(); }}>Registrate</span>
        </p>

        <p className="copyright">© 2026 DataScope</p>
      </div>
    </>
  );
}