import "./Perfil.css";
import { useAuth } from "../features/auth/context/AuthContext";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Perfil() {

    const { user, isLogged, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <section className="perfil-page">
            {/*  <div className="perfil-header">
                <h1 className="perfil-title">Panel de Control de Usuario</h1>
                <p className="perfil-subtitle">
                    Administra tu identidad digital, preferencias de comunicación y llaves
                    de acceso para el ecosistema DataScope.
                </p>
            </div>

            <div>
                <p>Nombre completo</p>
                <p>{user?.name}</p>
                <p>Correo electronico</p>
                <p>{user?.email}</p>
            </div>

            <button onClick={handleLogout}>Logout</button> */}
           
            

            <div className="perfil-header">
                <h1 className="perfil-title">Panel de Control de Usuario</h1>
                <p className="perfil-subtitle">
                    Administra tu identidad digital, preferencias de comunicación y llaves
                    de acceso para el ecosistema DataScope.
                </p>
            </div>

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
                                <span>{user?.username || "Francisco Gomez"}</span>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="form-label">CORREO ELECTRÓNICO</label>
                            <div className="form-input">
                                <span>{user?.email || "francisco.gomez@email.com"}</span>
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
                    </div>

                    <div className="card-actions">
                        <button className="btn-save">Guardar Cambios</button>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>


        </section>
    )
}
