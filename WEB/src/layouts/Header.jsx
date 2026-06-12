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
    const { isLogged, user, logout, setShowRegister, setShowLogin, showLogin, showRegister } = useAuth();

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
                        <li><Link to="/" className={rutaActual === '/' ? 'header__nav-active' : ''}>Home</Link></li>
                        <li><Link to="/about" className={rutaActual === '/about' ? 'header__nav-active' : ''}>About</Link></li>
                        
                        <li><Link to="#">Pricing</Link></li>
                        <li><Link to="#">Tutorial</Link></li>
                        {isLogged && <li><a href="#" className={rutaActual === '/overview' ? 'header__nav-active' : ''}>Overview</a></li>}
                    </ul>
                </nav>

                {isLogged && user ? (
                    <div
                        className="header__profile-menu-container"
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <Link to="/perfil" className="header__profile-link">
                            <img
                                className="header__profile-img"
                                src={user.profile_pic && user.profile_pic?.trim() !== "" ? user.profile_pic : perfilGenerico}
                                alt="Foto de perfil"
                            />

                            <p className="header__profile-text"> 
                                {user?.username?.trim() ? user?.username : 'user'}
                            </p>

                        </Link>

                        {isMenuOpen && (
                            <div className="header__profile-menu">
                                <button onClick={handleLogout} className="header__profile-menu-button">
                                    Cerrar Sesión
                                </button>
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