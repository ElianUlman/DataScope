import './About.css'
import { useAuth } from "../features/auth/context/AuthContext";

function About() {
  const { setShowRegister, isLogged } = useAuth();

  return (
    <div className="about-page">

      {/* Hero / Manifesto */}
      <section className="about-hero">
        <span className="about-tag"></span>
        <h1 className="about-title">Transparencia en la Era de la IA</h1>
        <p className="about-subtitle">
          DataScope nace en el epicentro de la mayor transformación tecnológica
          de la historia. Existimos para devolver la claridad a las organizaciones
          donde la IA opera en la sombra.
        </p>
      </section>

      {/* Valores */}
      <section className="about-valores">
        <h2 className="about-section-label">VALORES FUNDAMENTALES</h2>
        <div className="about-valores-grid">
          <div className="about-valor-card">
            <div className="about-valor-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.055 15.055 0 01-4.5 0M3 3l18 18" />
              </svg>
            </div>
            <h3>Innovación</h3>
            <p>No seguimos tendencias; las auditamos. Redefinimos constantemente qué significa trabajar con inteligencia artificial.</p>
          </div>
          <div className="about-valor-card">
            <div className="about-valor-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <h3>Transparencia</h3>
            <p>Creemos que el dato crudo es la única verdad. Eliminamos las capas de opacidad en el software corporativo.</p>
          </div>
          <div className="about-valor-card">
            <div className="about-valor-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3>Precisión</h3>
            <p>En el mundo de los datos, el error es ruido. Entregamos insights con exactitud quirúrgica.</p>
          </div>
        </div>
      </section>

      {/* Observatorio Digital */}
      <section className="about-observatorio">
        <div className="about-observatorio-text">
          <h2 className="about-green-title">Observatorio Digital</h2>
          <p>No somos solo software; somos el lente de precisión para el liderazgo moderno. Nuestra plataforma permite a líderes y equipos optimizar cada interacción con la IA.</p>
        </div>
        <div className="about-stats">
          <div className="about-stat-box">
            <span className="about-stat-number">94%</span>
            <span className="about-stat-label">VISIBILIDAD</span>
          </div>
          <div className="about-stat-box">
            <span className="about-stat-number">2.4x</span>
            <span className="about-stat-label">EFICIENCIA</span>
          </div>
        </div>
      </section>

      {/* Punto Ciego */}
      <section className="about-punto-ciego">
        <div className="about-punto-ciego-text">
          <h2>El Punto Ciego Corporativo</h2>
          <p>Las empresas están integrando IA a un ritmo sin precedentes. Sin embargo, la mayoría opera en una "caja negra". Sin visibilidad sobre cómo se utilizan estas herramientas, los líderes pierden el control sobre la eficiencia, la seguridad y el talento humano.</p>
        </div>
        <div className="about-punto-ciego-img">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="Sala de reuniones corporativa" />
        </div>
      </section>

      {/* Ojo de Halcón */}
      <section className="about-ojo">
        <div className="about-ojo-mockup">
          <div className="about-mockup-window">
            <div className="about-mockup-bar">
              <span /><span /><span />
            </div>
            <div className="about-mockup-content">
              <div className="about-mockup-sidebar">
                <div className="about-mockup-item" />
                <div className="about-mockup-item" />
                <div className="about-mockup-item" />
                <div className="about-mockup-item" />
              </div>
              <div className="about-mockup-main">
                <div className="about-mockup-chart">
                  <svg viewBox="0 0 200 80" preserveAspectRatio="none">
                    <polyline points="0,60 30,45 60,50 90,20 120,30 150,15 180,25 200,10" fill="none" stroke="#00e676" strokeWidth="2" />
                    <polyline points="0,60 30,45 60,50 90,20 120,30 150,15 180,25 200,10 200,80 0,80" fill="rgba(0,230,118,0.1)" strokeWidth="0" />
                  </svg>
                </div>
                <div className="about-mockup-dots">
                  <div /><div /><div /><div />
                </div>
              </div>
            </div>
            <div className="about-mockup-badge">● LIVE MONITOR ACTIVE</div>
          </div>
        </div>
        <div className="about-ojo-text">
          <span className="about-tag">NUESTRA TECNOLOGÍA</span>
          <h2 className="about-quote-title">'Ojo de Halcón'</h2>
          <p>Nuestra extensión de Google Chrome es el núcleo táctico de DataScope. Diseñada con una arquitectura ligera, actúa como un observador pasivo que captura métricas de interacción sin interrumpir el flujo de trabajo. Es la interfaz que conecta la intención humana con el rendimiento de la IA.</p>
          <ul className="about-feature-list">
            <li>
              <span className="about-check" />
              Análisis de Prompt-Efficiency en tiempo real
            </li>
            <li>
              <span className="about-check" />
              Detección de alucinaciones de IA corporativa
            </li>
            <li>
              <span className="about-check" />
              Opción de desactivación para privacidad
            </li>
          </ul>
        </div>
      </section>

      {/* Visión */}
      <section className="about-vision">
        <h2>Nuestra Visión</h2>
        <blockquote className="about-vision-quote">
          <span className="about-quote-mark left">"</span>
          El futuro no es una competencia entre humanos e IA,
          sino una sinfonía de colaboración donde la transparencia es el único
          director de orquesta posible. En DataScope, estamos escribiendo
          las partituras de esa nueva era.
          <span className="about-quote-mark right">"</span>
        </blockquote>
      </section>

      {/* CTA */}
      {!isLogged && (<section className="about-cta">
        <div className="about-cta-box">
          <h2 className="about-cta-title">Únete a la Revolución</h2>
          <p>Comienza hoy mismo a auditar el futuro de tu empresa con el Observatorio Digital más avanzado.</p>
          <button className="about-cta-btn" onClick={() => setShowRegister(true)} >Registrarse</button>
        </div>
      </section>)}


    </div>
  )
}

export default About
