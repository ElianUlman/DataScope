import "./Perfil.css";
import { useAuth } from "../features/auth/context/AuthContext";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Settings from "../features/auth/components/Settings.jsx";

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

            <Settings/>



        </section>
    )
}
