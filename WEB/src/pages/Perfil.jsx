import "./Perfil.css";
import { useAuth } from "../features/auth/context/AuthContext";
import { useState } from "react";

export default function Perfil({user, logout, setView}) {

    const { user, isLogged } = useAuth();

    const handleLogout = () => {
        logout()
        setView("LandingPage")
    }

    return (
        <section>
            <div>
                <h5>Panel de Control de Usuario</h5>
                <p>
                    Administra tu identidad digital, preferencias de comunicación y llaves de acceso para el
                    ecosistema DataScope.
                </p>
            </div>
            <div>
                <p>Nombre completo</p>
                <p>{user?.name}</p>
                <p>Correo electronico</p>
                <p>{user?.email}</p>
            </div>
            <button onClick={handleLogout}></button>
        </section>
    )
}
