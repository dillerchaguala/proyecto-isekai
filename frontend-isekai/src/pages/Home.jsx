import React, { useState } from "react"; // Importamos useState para manejar el estado de la modal
import "./Home.css";

import fondoTitulo from '../assets/fondoTitulo.jpeg'; // Fondo principal del Hero

// Iconos circulares debajo del hero (Registro emocional, Desafíos diarios, Seguimiento de progreso)
import caperucita from '../assets/caperucita.png'; // Usado para "Personajes Unicos" / Registro emocional
import hidra from '../assets/hidra.png';           // Usado para "Mascota Eterna" / Desafíos diarios
import fortuna from '../assets/fortuna.png';       // Usado para "Gemas" / Seguimiento de progreso (¡Ahora sí existe!)

// Iconos para la sección de Niveles de Acceso (Explorador, Aprendiz, Maestro)
import superHeroe from '../assets/superHeroe.png';
import mochila from '../assets/mochila.png';
import sombrero from '../assets/sombrero.png'; // ¡RUTA CORREGIDA AQUÍ!

// Imagen para la sección "Viaje Emocional"
import mapaEmocional from '../assets/fondoNegro.jpeg'; // Usamos 'fondoNegro.jpeg' como un PLACEHOLDER GENÉRICO

// Iconos del Footer
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png'; // Este era un error que me di cuenta
import xIcon from '../assets/x.png';


export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar la visibilidad de la modal

  const handleLoginClick = (e) => {
    e.preventDefault(); // Previene la recarga de la página si es un enlace <a href="#">
    setShowLoginModal(true); // Muestra la modal cuando se hace clic en "Iniciar sesión"
  };

  const handleCloseModal = () => {
    setShowLoginModal(false); // Oculta la modal cuando se hace clic en la flecha o fuera
  };

  return (
    <div className="isekai-home">
      {/* --------------------------- SECCIÓN HERO Y NAVEGACIÓN --------------------------- */}
      <header className="isekai-hero">
        <div className="isekai-hero-bg">
          <img src={fondoTitulo} alt="Bosque" className="isekai-bg-img" />
          <div className="isekai-hero-overlay">
            <h1 className="isekai-title">¡LIBERA TU BIENESTAR EMOCIONAL!</h1>
            <p className="isekai-subtitle">Explora, aprende y mejora tu salud emocional con ISekai</p>

            {/* !!! NUEVOS ELEMENTOS PARA AGENDAR CITA, TERAPIAS, ACTIVIDADES !!! */}
            <div className="isekai-hero-actions">
              <div className="isekai-action-item">
              <div className="isekai-action-icon-wrapper">
                    <i className="bi bi-check2-circle isekai-action-icon"></i>
                  </div>
                <h3>Agendar cita</h3>
              </div>
              <div className="isekai-action-item"> {/* Nuevo contenedor para cada item */}
                  <div className="isekai-action-icon-wrapper">
                    <i className="bi bi-people isekai-action-icon"></i>
                  </div>
                  <h3>Tipos de terapias</h3>
                </div>

              <div className="isekai-action-item"> {/* Nuevo contenedor para cada item */}
                  <div className="isekai-action-icon-wrapper">
                    <i className="bi bi-calendar2-check isekai-action-icon"></i>
                  </div>
                  <h3>Actividades</h3>
                </div>
            </div>
          </div>
        </div>
        <nav className="isekai-navbar">
          <ul>
            <li><a href="#niveles">Niveles</a></li>
            <li><a href="#beneficios-seccion">Beneficios</a></li>
            <li><a href="#contacto">Contacto</a></li>

            {/* CAMBIO: Botón para abrir la modal */}
            <li><button onClick={handleLoginClick} className="isekai-btn btn btn-primary">Iniciar sesión</button></li>
          </ul>
        </nav>
      </header>

      {/* --------------------------- NIVELES DE ACCESO --------------------------- */}
      <section id="niveles" className="isekai-niveles">
        <h2>NIVELES DE ACCESO</h2>
        <div className="isekai-niveles-cards">
          <div className="isekai-card">
            {/* Icono de Sombrero para "Exploradores" */}
            <img src={sombrero} alt="Icono Explorador - Sombrero" className="isekai-card-icon" />
            <h3>Exploradores</h3>
            <ul>
              <li>Acceso a recursos básicos</li>
              <li>Ejercicios y desafíos diarios</li>
              <li>Registro de emociones</li>
            </ul>
          </div>
          <div className="isekai-card">
            {/* Icono de Mochila para "Aventureros" */}
            <img src={mochila} alt="Icono Aprendiz - Mochila" className="isekai-card-icon" />
            <h3>Aventureros</h3>
            <ul>
              <li>Todo lo del nivel Explorador</li>
              <li>Seguimiento de progreso</li>
              <li>Logros y recompensas</li>
            </ul>
          </div>
          <div className="isekai-card">
            {/* Icono de SuperHéroe para "Heroes" */}
            <img src={superHeroe} alt="Icono Maestro - SuperHéroe" className="isekai-card-icon" />
            <h3>Heroes</h3>
            <ul>
              <li>Todo lo del nivel Aprendiz</li>
              <li>Terapia profesional</li>
              <li>Soporte personalizado</li>
            </ul>
          </div>
        </div>
        <div className="isekai-niveles-line"></div>
      </section>

      {/* --------------------------- SECCIÓN GLOBAL DE BENEFICIOS Y TERAPIA (CON LA ESTRUCTURA QUE ME ENVIASTE) --------------------------- */}
      <section className="isekai-terapia-beneficios-section" id="beneficios-seccion"> {/* Nuevo ID para la navegación */}
        <div className="isekai-terapia-y-cuadro-wrapper"> {/* Nuevo wrapper para los dos elementos superiores */}
            <div className="isekai-beneficios-list"> {/* Este tiene la p de "Terapia emocional profesional" */}
                <div className="isekai-beneficio-terapia"> {/* Clase específica para este div */}
                    <p>Terapia emocional profesional</p>
                </div>
            </div>
            <div className="isekai-beneficios-desc"> {/* Este es el cuadro de ISEKAI */}
                <h3 className="isekai-logo-central">ISEKAI</h3>
                <p>Tu espacio para el bienestar emocional. Descubre herramientas, recursos y acompañamiento profesional para mejorar tu salud mental.</p>
            </div>
        </div>

        <h2 className="isekai-beneficios-titulo-lista">Beneficios</h2> {/* Clase para el H2 de Beneficios */}
        {/* Contenedor para los 3 beneficios con checkmark */}
        <div className="isekai-beneficios-items-container">
            <div className="isekai-beneficio-item"> {/* Clase renombrada para mayor claridad */}
                <p>Acompañamiento emocional flexible y adaptado al ritmo de cada usuario</p>
            </div>
            <div className="isekai-beneficio-item">
                <p>Educacion emocional accesible, divertida y visualmente atractiva</p>
            </div>
            <div className="isekai-beneficio-item">
                <p>Un entorno seguro que combina apoyo profesional y lenguaje narrativo inmersivo</p>
            </div>
        </div>
      </section>

      {/* --------------------------- SECCIÓN VIAJE EMOCIONAL --------------------------- */}
      <section className="isekai-viaje-emocional">
        <h2>Beneficios del viaje emocional</h2>
        <div className="isekai-viaje-content">
          <div className="isekai-viaje-text">
            <p>Descubre el mapa de tu bienestar emocional y desbloquea logros a medida que avanzas. Cada paso te acerca a una mejor versión de ti mismo.</p>
          </div>
          <div className="isekai-viaje-img">
            {/* Usando 'fondoNegro' como placeholder para el mapa */}
            <img src={mapaEmocional} alt="Mapa emocional" />
          </div>
        </div>
      </section>

      {/* --------------------------- ICONOS CIRCULARES DE RECOMPENSAS (ABAJO) --------------------------- */}
      <section className="isekai-hero-icons">
        <h2 className="isekai-rewards-title">CADA ACTIVIDAD QUE COMPLETES, TE DARA LAS SIGUIENTES RECOMPENSAS</h2>
        <div className="isekai-hero-icon-container"> {/* Contenedor crucial para la disposición horizontal */}
          <div className="isekai-hero-icon">
            <img src={caperucita} alt="Personajes Unicos" />
            <div>PERSONAJE UNICOS</div>
          </div>
          <div className="isekai-hero-icon">
            <img src={hidra} alt="Mascota Eterna" />
            <div>MASCOTA ETERNA</div>
          </div>
          <div className="isekai-hero-icon">
            <img src={fortuna} alt="Gemas" />
            <div>GEMAS</div>
          </div>
        </div>
      </section>

      {/* --------------------------- MISIÓN FINAL --------------------------- */}
      <section className="isekai-mision">
        <h2>¿Qué esperas para
comenzar tu viaje emocional?</h2>
        <p>Únete a ISekai y transforma tu bienestar emocional con ayuda profesional, recursos y comunidad.</p>
      </section>

      {/* --------------------------- FOOTER --------------------------- */}
      <footer className="isekai-footer" id="contacto">
        <div className="isekai-footer-content">
          <div>
            <strong>Contacto:</strong> contacto@isekai.com<br />
            <strong>Teléfono:</strong> +57 300 000 0000
          </div>
          <div className="isekai-footer-social">
            <a href="#"><img src={facebook} alt="Facebook" /></a>
            <a href="#"><img src={instagram} alt="Instagram" /></a> {/* Corregido el alt si era incorrecto */}
            <a href="#"><img src={xIcon} alt="X (Twitter)" /></a>
          </div>
        </div>
        <div className="isekai-footer-copy">© 2025 ISekai. Todos los derechos reservados.</div>
      </footer>

      {/* --------------------------- MODAL DE LOGIN --------------------------- */}
      {showLoginModal && ( // Renderiza la modal solo si showLoginModal es true
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="back-arrow" onClick={handleCloseModal}>
                &larr; {/* Flecha de volver */}
              </span>
              <h2>Iniciar sesión</h2>
            </div>
            <form className="login-form">
              <div className="form-group">
                <input type="text" placeholder="Usuario" className="form-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Contraseña" className="form-input" />
              </div>
              <button type="submit" className="login-button">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}