
import React from "react";
import "./Home.css";

import forestBg from '../assets/forestBg.webp';
import icon1 from '../assets/icon1.svg';
import icon2 from '../assets/icon2.svg';
import icon3 from '../assets/icon3.svg';
import beneficio1 from '../assets/beneficio1.svg';
import beneficio2 from '../assets/beneficio2.svg';
import beneficio3 from '../assets/beneficio3.svg';
import mapaEmocional from '../assets/mapa-emocional.png';
import icon4 from '../assets/icon4.svg';
import icon5 from '../assets/icon5.svg';
import icon6 from '../assets/icon6.svg';
import icon7 from '../assets/icon7.svg';
import facebook from '../assets/facebook.svg';
import instagram from '../assets/instagram.svg';

export default function Home() {
  return (
    <div className="isekai-home">
      <header className="isekai-hero">
        <div className="isekai-hero-bg">
          <img src={forestBg} alt="Bosque" className="isekai-bg-img" />
          <div className="isekai-hero-overlay">
            <h1 className="isekai-title" style={{fontSize: '2.2rem', marginBottom: '0.5rem'}}>¡LIBERA TU BIENESTAR EMOCIONAL!</h1>
            <p className="isekai-subtitle" style={{fontSize: '1.1rem'}}>Explora, aprende y mejora tu salud emocional con ISekai</p>
          </div>
        </div>
        <nav className="isekai-navbar">
          <ul>
            <li><a href="#niveles">Niveles</a></li>
            <li><a href="#beneficios">Beneficios</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="/iniciar-sesion" className="isekai-btn">Iniciar sesión</a></li>
          </ul>
        </nav>
      </header>

      {/* Iconos circulares debajo del hero, tamaño reducido y con texto */}
      <section className="isekai-hero-icons" style={{display: 'flex', justifyContent: 'center', gap: '2rem', margin: '18px 0'}}>
        <div className="isekai-hero-icon" style={{textAlign: 'center'}}>
          <img src={icon1} alt="icono1" style={{width: '48px', height: '48px'}} />
          <div style={{fontSize: '0.95rem', marginTop: '6px'}}>Registro emocional</div>
        </div>
        <div className="isekai-hero-icon" style={{textAlign: 'center'}}>
          <img src={icon2} alt="icono2" style={{width: '48px', height: '48px'}} />
          <div style={{fontSize: '0.95rem', marginTop: '6px'}}>Desafíos diarios</div>
        </div>
        <div className="isekai-hero-icon" style={{textAlign: 'center'}}>
          <img src={icon3} alt="icono3" style={{width: '48px', height: '48px'}} />
          <div style={{fontSize: '0.95rem', marginTop: '6px'}}>Seguimiento de progreso</div>
        </div>
      </section>

      {/* Niveles de acceso con líneas */}
      <section id="niveles" className="isekai-niveles" style={{paddingTop: '24px'}}>
        <h2 style={{fontSize: '1.5rem', marginBottom: '18px'}}>NIVELES DE ACCESO</h2>
        <div className="isekai-niveles-cards" style={{display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap'}}>
          <div className="isekai-card" style={{width: '170px', minWidth: '140px', padding: '16px 10px'}}>
            <h3 style={{fontSize: '1.05rem'}}>Explorador</h3>
            <ul style={{fontSize: '0.95rem'}}>
              <li>Acceso a recursos básicos</li>
              <li>Ejercicios y desafíos diarios</li>
              <li>Registro de emociones</li>
            </ul>
          </div>
          <div className="isekai-card" style={{width: '170px', minWidth: '140px', padding: '16px 10px'}}>
            <h3 style={{fontSize: '1.05rem'}}>Aprendiz</h3>
            <ul style={{fontSize: '0.95rem'}}>
              <li>Todo lo del nivel Explorador</li>
              <li>Seguimiento de progreso</li>
              <li>Logros y recompensas</li>
            </ul>
          </div>
          <div className="isekai-card" style={{width: '170px', minWidth: '140px', padding: '16px 10px'}}>
            <h3 style={{fontSize: '1.05rem'}}>Maestro</h3>
            <ul style={{fontSize: '0.95rem'}}>
              <li>Todo lo del nivel Aprendiz</li>
              <li>Terapia profesional</li>
              <li>Soporte personalizado</li>
            </ul>
          </div>
        </div>
        <div className="isekai-niveles-line" style={{height: '2px', background: '#e0e0e0', margin: '18px auto 0 auto', maxWidth: '400px'}}></div>
      </section>

      {/* Beneficios con iconos */}
      <section className="isekai-beneficios" id="beneficios" style={{paddingTop: '18px'}}>
        <h2 style={{fontSize: '1.3rem', marginBottom: '12px'}}>Beneficios</h2>
        <div className="isekai-beneficios-list" style={{display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '10px', flexWrap: 'wrap'}}>
          <div className="isekai-beneficio" style={{width: '120px', minWidth: '100px', padding: '10px 6px'}}>
            <img src={beneficio1} alt="beneficio1" style={{width: '38px', height: '38px'}} />
            <p style={{fontSize: '0.95rem', marginTop: '6px'}}>Terapia emocional profesional</p>
          </div>
          <div className="isekai-beneficio" style={{width: '120px', minWidth: '100px', padding: '10px 6px'}}>
            <img src={beneficio2} alt="beneficio2" style={{width: '38px', height: '38px'}} />
            <p style={{fontSize: '0.95rem', marginTop: '6px'}}>Seguimiento y registro de emociones</p>
          </div>
          <div className="isekai-beneficio" style={{width: '120px', minWidth: '100px', padding: '10px 6px'}}>
            <img src={beneficio3} alt="beneficio3" style={{width: '38px', height: '38px'}} />
            <p style={{fontSize: '0.95rem', marginTop: '6px'}}>Desafíos y ejercicios diarios</p>
          </div>
        </div>
        <div className="isekai-beneficios-desc" style={{marginTop: '10px', fontSize: '1rem', color: '#2c3e50'}}>
          <h3 className="isekai-logo-central" style={{fontSize: '2.2rem', color: '#e0e0e0', fontWeight: 'bold', margin: '0'}}>ISEKAI</h3>
          <p style={{margin: '8px 0 0 0'}}>Tu espacio para el bienestar emocional. Descubre herramientas, recursos y acompañamiento profesional para mejorar tu salud mental.</p>
        </div>
      </section>

      {/* Sección viaje emocional con imagen tipo mapa */}
      <section className="isekai-viaje-emocional" style={{padding: '18px 0'}}>
        <h2 style={{fontSize: '1.1rem', marginBottom: '8px'}}>Beneficios del viaje emocional</h2>
        <div className="isekai-viaje-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className="isekai-viaje-text" style={{maxWidth: '320px', fontSize: '0.98rem', marginBottom: '8px', textAlign: 'center'}}>
            <p>Descubre el mapa de tu bienestar emocional y desbloquea logros a medida que avanzas. Cada paso te acerca a una mejor versión de ti mismo.</p>
          </div>
          <div className="isekai-viaje-img" style={{marginBottom: '8px'}}>
            <img src={mapaEmocional} alt="Mapa emocional" style={{width: '120px', height: '120px', borderRadius: '12px', boxShadow: '0 2px 8px #e0e0e0'}} />
          </div>
        </div>
      </section>

      {/* Iconos inferiores */}
      <section className="isekai-icons-bottom" style={{display: 'flex', justifyContent: 'center', gap: '1.2rem', margin: '12px 0'}}>
        <div className="isekai-icon-bottom" style={{textAlign: 'center'}}><img src={icon4} alt="icono4" style={{width: '38px', height: '38px'}} /><p style={{fontSize: '0.9rem', margin: '4px 0 0 0'}}>Comunidad</p></div>
        <div className="isekai-icon-bottom" style={{textAlign: 'center'}}><img src={icon5} alt="icono5" style={{width: '38px', height: '38px'}} /><p style={{fontSize: '0.9rem', margin: '4px 0 0 0'}}>Logros</p></div>
        <div className="isekai-icon-bottom" style={{textAlign: 'center'}}><img src={icon6} alt="icono6" style={{width: '38px', height: '38px'}} /><p style={{fontSize: '0.9rem', margin: '4px 0 0 0'}}>Emociones</p></div>
        <div className="isekai-icon-bottom" style={{textAlign: 'center'}}><img src={icon7} alt="icono7" style={{width: '38px', height: '38px'}} /><p style={{fontSize: '0.9rem', margin: '4px 0 0 0'}}>Soporte</p></div>
      </section>

      {/* Misión final */}
      <section className="isekai-mision" style={{padding: '18px 0', textAlign: 'center'}}>
        <h2 style={{fontSize: '1.1rem', marginBottom: '6px'}}>¿Qué esperas para comenzar tu viaje emocional?</h2>
        <p style={{fontSize: '0.98rem'}}>Únete a ISekai y transforma tu bienestar emocional con ayuda profesional, recursos y comunidad.</p>
      </section>

      {/* Footer */}
      <footer className="isekai-footer" id="contacto" style={{background: '#e0e0e0', color: '#2c3e50', padding: '18px 0 8px 0', textAlign: 'center', fontSize: '0.98rem'}}>
        <div className="isekai-footer-content" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', margin: '0 auto 8px auto', flexWrap: 'wrap'}}>
          <div style={{textAlign: 'left'}}>
            <strong>Contacto:</strong> contacto@isekai.com<br />
            <strong>Teléfono:</strong> +57 300 000 0000
          </div>
          <div className="isekai-footer-social" style={{textAlign: 'right'}}>
            <a href="#"><img src={facebook} alt="Facebook" style={{width: '22px', height: '22px', marginRight: '6px'}} /></a>
            <a href="#"><img src={instagram} alt="Instagram" style={{width: '22px', height: '22px'}} /></a>
          </div>
        </div>
        <div className="isekai-footer-copy" style={{fontSize: '0.9rem', color: '#888'}}>© 2025 ISekai. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
