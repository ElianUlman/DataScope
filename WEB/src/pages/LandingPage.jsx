import { useState, useEffect } from "react";
import "./LandingPage.css";
import LoginModal from "../popup/LoginModal";
import RegisterModal from "../popup/RegisterModal";

// — Imágenes: reemplazá estas rutas por tus archivos en src/assets/ —
// Ejemplo: import imgFondo from "../assets/hero-bg.png"
const imgFondo            = "https://placehold.co/1440x960/0e0e0e/2ee88a?text=Hero+BG";
const imgImage13          = "https://placehold.co/707x422/1a1919/2ee88a?text=Dashboard";
const imgSecureDataCenter = "https://placehold.co/400x228/131313/2ee88a?text=Data+Center";
const imgLogo             = null; // reemplazá por: import imgLogo from "../assets/logo.png"
const iconStats           = null;
const iconQA              = null;
const iconOptimize        = null;
const iconArrow           = null;

const STATS = [
  { title: "Mantén la información\nde tu empresa a salvo", sub: "Tenemos el conocimiento necesario" },
  { title: "+10.000 empresas\nconfían en nosotros",        sub: "No pongas en peligro tu información" },
  { title: "Trabaja a una velocidad\nimparable",           sub: "Hasta un 50% de eficiencia" },
];

const BARS = [
  { height: 80,  opacity: 0.2 },
  { height: 120, opacity: 0.4 },
  { height: 100, opacity: 0.6 },
  { height: 170, opacity: 1   },
  { height: 60,  opacity: 0.4 },
];



export default function LandingPage() {
  

  return (
    <div className="landing">

      

      

      {/* ── HERO ── */}
      <section className="hero">
        <img src={imgFondo} alt="" className="hero__bg" />
        <div className="hero__content">
          <h1 className="hero__title fade-up fade-up--1">
            Optimiza la eficiencia<br />
            de tu equipo en <span>IA</span>
          </h1>
          <a href="#" className="btn btn--primary fade-up fade-up--2">Conocé más</a>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats">
        {STATS.map((s, i) => (
          <div className="stats__item" key={i}>
            <p className="stats__title">{s.title}</p>
            <p className="stats__sub">{s.sub}</p>
          </div>
        ))}
      </section>

      {/* ── FEATURES BENTO GRID ── */}
      <section className="features">
        <div className="features__header">
          <h2 className="features__heading">El Observatorio de Rendimiento</h2>
          <p className="features__subheading">
            Control total sobre el despliegue de inteligencia artificial en tu
            organización con métricas que importan.
          </p>
        </div>

        <div className="bento">

          {/* Main — Stats en tiempo real */}
          <div className="bento__card bento__card--main">
            <div className="bento__glow" />
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="10" width="3" height="9" rx="1" fill="#2ee88a"/><rect x="6" y="6" width="3" height="13" rx="1" fill="#2ee88a"/><rect x="11" y="8" width="3" height="11" rx="1" fill="#2ee88a"/><rect x="16" y="2" width="3" height="17" rx="1" fill="#2ee88a"/></svg>
            </div>
            <h3 className="card__title">Estadísticas en Tiempo Real</h3>
            <p className="card__desc">
              Visualiza el impacto directo de la IA. Monitorea cada interacción
              y descubre patrones de uso instantáneamente.
            </p>
            <div className="bar-chart">
              {BARS.map((b, i) => (
                <div
                  key={i}
                  className="bar-chart__bar"
                  style={{ height: b.height, opacity: b.opacity }}
                />
              ))}
            </div>
          </div>

          {/* Secondary — Optimización */}
          <div className="bento__card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm1-9H9v3H6l4 4 4-4h-3V7z" fill="#2ee88a"/></svg>
            </div>
            <h3 className="card__title">Optimización de Procesos</h3>
            <p className="card__desc">
              Identifica dónde se puede mejorar el uso de las herramientas.
              Detecta cuellos de botella en la interacción humana-IA.
            </p>
          </div>

          {/* Secondary — Calidad */}
          <div className="bento__card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.7 3.3L8 12 4.3 8.3 3 9.7l5 5 10-10-1.3-1.4z" fill="#2ee88a"/></svg>
            </div>
            <h3 className="card__title">Calidad Garantizada</h3>
            <p className="card__desc">
              Asegúrate de que el contenido generado cumple con tus estándares
              mediante auditorías automáticas de calidad.
            </p>
            <div className="qa">
              <div className="qa__track">
                <div className="qa__fill" />
              </div>
              <div className="qa__labels">
                <span>QA SCORE</span>
                <span>94% OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Wide — Seguridad */}
          <div className="bento__card bento__card--security">
            <div className="security__text">
              <h3 className="card__title">Seguridad Nivel Enterprise</h3>
              <p className="card__desc">
                Tus datos nunca salen de tu entorno corporativo. DataScope actúa
                como un filtro de privacidad activo.
              </p>
              <a href="#" className="security__link">
                Leer sobre seguridad
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l6 6-6 6M1 7h12" stroke="#2ee88a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="security__img">
              <img src={imgSecureDataCenter} alt="Secure Data Center" />
            </div>
          </div>

        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="dashboard">
        <div className="dashboard__card">
          <div className="dashboard__inner">
            <div className="dashboard__metrics">
              <p className="dashboard__label">Impacto Real</p>
              <p className="dashboard__sublabel">
                Resumen de las últimas 24 horas de actividad de tu equipo.
              </p>
              <div className="metric">
                <p className="metric__label">Prompts Enviados</p>
                <p className="metric__value">1,429</p>
              </div>
              <div className="metric">
                <p className="metric__label">Horas Ahorradas</p>
                <p className="metric__value metric__value--green">342.5</p>
              </div>
            </div>
            <div className="dashboard__chart">
              <img src={imgImage13} alt="Dashboard Preview" />
              <div className="dashboard__chart-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="cta">
        <div className="cta__card">
          <h2 className="cta__title">
            Toma el control de tu transformación digital.
          </h2>
          <p className="cta__sub">
            Únete a los líderes que ya están midiendo el ROI real de la
            inteligencia artificial.
          </p>
          <button onClick={() => setShowRegister(true)} className="btn btn--cta">Registrarse</button>
        </div>
      </section>

      

    </div>
  );
}
