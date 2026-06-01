import { useState, useEffect } from "react";
import "./Header.css"
import LoginModal from "../features/auth/components/LoginModal";
import RegisterModal from "../features/auth/components/RegisterModal";
import { useAuth } from "../features/auth/context/AuthContext";
import perfilGenerico from "../assets/perfilGenerico.jpg";
import { useNavigate, useLocation, Link } from 'react-router-dom';

import imgLogo from "../assets/imgLogo.png"

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const { isLogged, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const rutaActual = location.pathname;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        logout()
        if (rutaActual != '/') navigate('/')
    }

    return (
        <div>
            <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
                {imgLogo
                    ? <img src={imgLogo} alt="DataScope" className="header__logo" />
                    : <span className="header__logo-text">DataScope</span>
                }
                <nav>
                    <ul className="header__nav">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="#">Pricing</Link></li>
                        <li><Link to="#">Tutorial</Link></li>
                        {isLogged && <li><a href="#">Overview</a></li>}
                    </ul>
                </nav>

                {isLogged && user ? (
                    <div
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <Link to="/about">
                            <img
                                src={user.url && user.url.trim() !== "" ? user.url : perfilGenerico}
                                alt="Foto de perfil"
                                onClick={() => navigate('/perfil')}
                            />
                        </Link>

                        {isMenuOpen && (
                            <div>
                                <ul>
                                    <li>
                                        <button onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(true)} className="btn btn--login">
                        Login
                    </button>
                )}

            </header>

            {showLogin && (
                <div className="modal-root">
                    <LoginModal onClose={() => setShowLogin(false)} onOpenRegister={() => setShowRegister(true)} />
                </div>
            )}

            {showRegister && (
                <div className="modal-root">
                    <RegisterModal onClose={() => setShowRegister(false)} onOpenLogin={() => setShowLogin(true)} />
                </div>
            )}

        </div>
    )
}

export default Header