import "./RegisterModal.css";
import { Eye, AtSign } from "lucide-react";
import { useState } from 'react'
import { useAuth } from "../context/AuthContext";

export default function RegisterModal({ onClose, onOpenLogin }) {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [message, setMessage] = useState()
  const { signup } = useAuth()

  const handleSubmit = async () => {
    setMessage("")
    const result = await signup(username, email, password)

    if (result == true) {
      onClose()
    } else {
      setMessage("Hubo un error")
    }

  }
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="register-modal">
        <button className="register-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        <h1>REGISTRO</h1>

        <div className="input-group">
          <label>USERNAME</label>
          <input type="text" placeholder="Nombre de usuario" onChange={(e)=>setUsername(e.target.value)}/>
        </div>

        <div className="input-group">
          <label>EMAIL ADDRESS</label>

          <div className="input-icon">
            <input type="email" placeholder="nombre@compania.com" onChange={(e)=>setEmail(e.target.value)}/>
            <AtSign size={18} className="icon" />
          </div>
        </div>

        <div className="input-group">
          <label>PASSWORD</label>

          <div className="input-icon">
            <input type="password" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)}/>
            <Eye size={18} className="icon" />
          </div>
        </div>

        <div className="remember">
          <input type="checkbox" />
          <span>Recordar mi cuenta</span>
        </div>
        <p>{message}</p>
        <button className="register-btn" onClick={() => handleSubmit()}>Registrarme</button>

        <p className="bottom-text">
          ¿Ya tenes una cuenta? <span onClick={() => { onOpenLogin(); onClose(); }}>Inicia sesion</span>
        </p>

        <p className="copyright">© 2026 DataScope</p>
      </div>
    </>
  );
}