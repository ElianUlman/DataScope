import React from 'react'
import "./Footer.css"

const FOOTER_LINKS = ["Privacidad", "Términos", "Contacto", "LinkedIn", "Twitter"];

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__brand">
                <h3>DataScope</h3>
                <p>
                    El Observatorio Digital para la era de la inteligencia artificial.
                    Precisión, claridad y verdad en los datos.
                </p>
            </div>
            <ul className="footer__links">
                {FOOTER_LINKS.map((l) => (
                    <li key={l}><a href="#">{l}</a></li>
                ))}
            </ul>
            <p className="footer__copy">© 2026 DataScope</p>
        </footer>
    )
}

export default Footer