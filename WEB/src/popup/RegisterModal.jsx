import "./RegisterModal.css";
import { Eye, AtSign } from "lucide-react";

export default function RegisterModal({ onClose }) {
  return (
    <div className="register-modal">
      <button className="register-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
      <h1>REGISTRO</h1>

      <div className="input-group">
        <label>USERNAME</label>
        <input type="text" placeholder="Nombre de usuario" />
      </div>

      <div className="input-group">
        <label>EMAIL ADDRESS</label>

        <div className="input-icon">
          <input type="email" placeholder="nombre@compania.com" />
          <AtSign size={18} className="icon" />
        </div>
      </div>

      <div className="input-group">
        <label>PASSWORD</label>

        <div className="input-icon">
          <input type="password" placeholder="••••••••" />
          <Eye size={18} className="icon" />
        </div>
      </div>

      <div className="remember">
        <input type="checkbox" />
        <span>Recordar mi cuenta</span>
      </div>

      <button className="register-btn">Registrarme</button>

      <p className="bottom-text">
        ¿Ya tenes una cuenta? <span>Inicia sesion</span>
      </p>

      <p className="copyright">© 2026 DataScope</p>
    </div>
  );
}