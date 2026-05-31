import { useState, useEffect } from "react";
import "./Header.css"
import LoginModal from "../features/auth/components/LoginModal";
import RegisterModal from "../features/auth/components/RegisterModal";
import { useAuth } from "../features/auth/context/AuthContext";

import imgLogo from "../assets/imgLogo.png"

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const { user, isLogged } = useAuth()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div>
            <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
                {imgLogo
                    ? <img src={imgLogo} alt="DataScope" className="header__logo" />
                    : <span className="header__logo-text">DataScope</span>
                }
                <nav>
                    <ul className="header__nav">
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Tutorial</a></li>
                        {isLogged && <li><a href="#">Overview</a></li>}
                    </ul>
                </nav>

                {isLogged ? <p>{user.username}</p> : <button onClick={() => setShowLogin(true)} className="btn btn--login">Login</button>

                }
                
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