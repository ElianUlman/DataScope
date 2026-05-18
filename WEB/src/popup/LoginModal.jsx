import "./LoginModal.css";
import { Eye, AtSign } from "lucide-react";

export default function LoginModal({ onClose }) {
  return (
    <div className="login-modal">
      <button className="login-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
      <h1>INICIO DE SESION</h1>

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

      <button className="login-btn">Iniciar</button>

      <p className="bottom-text">
        ¿No tenes una cuenta? <span>Registrate</span>
      </p>

      <p className="copyright">© 2026 DataScope</p>
    </div>
  );
}