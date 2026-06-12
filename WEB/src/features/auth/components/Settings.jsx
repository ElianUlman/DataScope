import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


export default function Settings() {
    const { user, isLogged, logout, updateUserData } = useAuth();
    const navigate = useNavigate();
    

    const [image, setImage] = useState()
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    
    const handleSubmit = () => {

        updateUserData(username, email)
        navigate('/')
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }


    return (
        <div className="perfil-grid">
            <div className="perfil-card">
                <div className="card-heading">
                    <span className="card-heading-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <h2 className="card-title">Perfil Personal</h2>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label className="form-label">NOMBRE COMPLETO</label>
                        <div className="form-input">
                            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">CORREO ELECTRÓNICO</label>
                        <div className="form-input">
                            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                            
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">ROL EN LA ORGANIZACIÓN</label>
                        <div className="form-role-badge">
                            <span>{user?.userrole || "Analista de Datos Senior"}</span>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">ZONA HORARIA</label>
                        <div className="form-input form-select">
                            <span>{user?.usertimezone || "Europe/Madrid (GMT+2)"}</span>
                            <svg className="select-chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>


                    {/**
                     * <input
                        type="file"
                        accept="image/*"
                        onChange={(e)=>setImage(e.target.files?.[0])}
                    />
                    
                    {image && <img src={URL.createObjectURL(image)} alt="eee" />} 
                    */}

                </div>

                <div className="card-actions">
                    <button className="btn-save" onClick={handleSubmit}>Guardar Cambios</button>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}