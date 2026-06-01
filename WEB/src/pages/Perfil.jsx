import "./Perfil.css";

export default function Perfil({user, logout, setView}) {

    const handleLogout = () => {
        logout()
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
