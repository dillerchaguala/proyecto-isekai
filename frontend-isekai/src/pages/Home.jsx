import React, { useState } from "react";

// ***** ELIMINAR COMPLETAMENTE ESTE BLOQUE DE CÓDIGO *****
// Si lo sigues teniendo, es una fuente de conflicto.
/*
if (typeof document !== 'undefined') {
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
}
*/

import fondoTitulo from '../assets/fondoTitulo.jpeg';
import caperucita from '../assets/caperucita.png';
import hidra from '../assets/hidra.png';
import fortuna from '../assets/fortuna.png';

import superHeroe from '../assets/superHeroe.png';
import mochila from '../assets/mochila.png';
import sombrero from '../assets/sombrero.png';

import mapaEmocional from '../assets/fondoNegro.jpeg';

import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import xIcon from '../assets/x.png';


export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    // ***** CONTENEDOR PRINCIPAL: Solo 'w-full' y 'overflow-x-hidden' *****
    // No 'fixed', no 'w-[100vw]', no 'style={{width:'100vw'}}'.
    // 'min-h-screen' para que ocupe al menos la altura de la pantalla.
    <div className="bg-white font-sans m-0 p-0 min-h-screen w-full overflow-x-hidden">
      {/* ***** ELIMINAR COMPLETAMENTE ESTE BLOQUE <style> *****
          Esta es la CAUSA RAÍZ de muchos de los problemas.
          Debe ir en tu archivo CSS global (ej. src/index.css) si es necesario.
      */}
      {/*
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          min-height: 100vh !important;
          height: 100vh !important;
          box-sizing: border-box;
          overflow-x: hidden !important;
          background: #fff;
        }
        #root, .App {
          width: 100vw !important;
          min-height: 100vh !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }
      `}</style>
      */}

      {/* NAV: Ocupa todo el ancho, padding interno para el contenido */}
      <nav className="w-full bg-[#234032] flex items-center justify-between px-4 md:px-8 py-0 h-14 z-30">
        <div className="flex items-center h-full pl-8">
          {/* Logo o espacio vacío */}
        </div>
        <div className="flex items-center h-full pr-8 gap-4">
          <button onClick={handleLoginClick} className="bg-yellow-300 text-[#234032] px-5 py-1.5 rounded font-bold shadow-none hover:bg-yellow-400 transition-colors">Iniciar sesión</button>
          <button className="bg-white text-[#234032] px-5 py-1.5 rounded font-bold border-2 border-yellow-300 hover:bg-yellow-100 transition-colors">Crear cuenta</button>
        </div>
      </nav>

      {/* HERO: Ocupa todo el ancho */}
      <header className="relative w-full h-[80vh] flex flex-col justify-end items-center p-0 m-0">
        <img src={fondoTitulo} alt="Bosque" className="absolute inset-0 w-full h-full object-cover object-center brightness-[1.15] z-0" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pt-10">
          <svg width="500" height="220" viewBox="0 0 500 220" className="mb-0 w-full h-auto" style={{maxWidth:'90vw'}}>
            <defs>
              <path id="arcPath" d="M 60 200 Q 250 20 440 200" fill="transparent" />
            </defs>
            <text fontSize="54" fontWeight="bold" fill="#FFD600" letterSpacing="6" textAnchor="middle">
              <textPath href="#arcPath" startOffset="50%" dominantBaseline="middle">ISEKAI</textPath>
            </text>
          </svg>
          <div className="-mt-20 mb-8">
            <span
              className="block text-5xl md:text-6xl font-bold uppercase text-[#FFD600] drop-shadow-lg text-center tracking-[.35em] font-sans"
              // Ajustado transform y letterSpacing. Si aún se desborda, reduce letterSpacing a '0em'.
              style={{ letterSpacing: '0.03em', marginTop: '-64px', transform: 'scaleX(1.0)' }}
            >
              TERAPIA GAMIFICADA
            </span>
          </div>
          <div className="flex flex-row justify-center items-end w-full min-w-0 mt-2 mb-32" style={{ columnGap: '17rem' }}>
            <div className="flex flex-col items-center group">
              <div className="bg-transparent rounded-full p-16 shadow-none border-none group-hover:scale-105 transition-transform flex items-center justify-center">
                <i className="bi bi-calendar2-check text-[3rem] text-white"></i>
              </div>
              <span className="text-white font-bold text-lg mt-4 tracking-wide">Agendar cita</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-transparent rounded-full p-16 shadow-none border-none group-hover:scale-105 transition-transform flex items-center justify-center">
                <i className="bi bi-people text-[3rem] text-white"></i>
              </div>
              <span className="text-white font-bold text-lg mt-4 tracking-wide">Tipos de terapia</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-transparent rounded-full p-16 shadow-none border-none group-hover:scale-105 transition-transform flex items-center justify-center">
                <i className="bi bi-trophy text-[3rem] text-white"></i>
              </div>
              <span className="text-white font-bold text-lg mt-4 tracking-wide">Actividades</span>
            </div>
          </div>
        </div>
      </header>

      {/* --------------------------- NIVELES DE ACCESO --------------------------- */}
      {/* Sección principal que ocupa todo el ancho, padding horizontal se maneja en un div interno */}

      <section id="niveles" className="w-full pt-0 pb-16 bg-gradient-to-b from-[#f7fafc] to-[#e3e8ee]">
        <div className="w-full max-w-7xl mx-auto mt-0 p-0 flex flex-col justify-start px-4 md:px-8">
          <h2
            className="w-full text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase text-[#234032] drop-shadow-lg text-left font-sans mb-10"
            style={{
              letterSpacing: '0.05em',
              transform: 'scaleX(1)',
              minHeight: '60px',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            NIVELES DE ACCESO
          </h2>
          <div className="flex flex-col md:flex-row gap-6 w-full min-w-0 pb-8 items-center md:items-stretch justify-center">
            {/* Exploradores */}
            <div className="flex flex-col items-center bg-white border-2 border-[#234032] rounded-xl shadow px-4 py-3 text-center min-w-[160px] max-w-[220px] w-full md:w-[200px] relative">
              <div className="mb-1 flex items-center justify-center">
                <img src={sombrero} alt="Icono Explorador - Sombrero" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#234032] mb-1 tracking-wide">EXPLORADORES</h3>
              <ul className="text-gray-700 text-xs space-y-0.5 list-none p-0 mb-3">
                <li>Ver toda la guía elemental</li>
                <li>Diario emocional temático</li>
                <li>Reto semanal gratuito</li>
              </ul>
              <button className="mt-auto border-2 border-[#234032] text-[#234032] px-3 py-0.5 rounded-full font-bold bg-white hover:bg-[#234032] hover:text-white transition-colors shadow-sm text-xs">Adquirir</button>
            </div>
            {/* Aventureros */}
            <div className="flex flex-col items-center bg-white border-2 border-[#1a3a2b] rounded-xl shadow px-4 py-3 text-center min-w-[160px] max-w-[220px] w-full md:w-[200px] relative">
              <div className="mb-1 flex items-center justify-center">
                <img src={mochila} alt="Icono Aventurero - Mochila" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1a3a2b] mb-1 tracking-wide">AVENTUREROS</h3>
              <ul className="text-gray-700 text-xs space-y-0.5 list-none p-0 mb-3">
                <li>Reto terapéutico, actividades especiales</li>
                <li>Contenido desbloqueado (videos, audio, etc)</li>
                <li>Feedback técnico de un profesional</li>
              </ul>
              <button className="mt-auto border-2 border-[#1a3a2b] text-[#1a3a2b] px-3 py-0.5 rounded-full font-bold bg-white hover:bg-[#1a3a2b] hover:text-white transition-colors shadow-sm text-xs">Adquirir</button>
            </div>
            {/* Heroes */}
            <div className="flex flex-col items-center bg-white border-2 border-[#fe5f55] rounded-xl shadow px-4 py-3 text-center min-w-[160px] max-w-[220px] w-full md:w-[200px] relative">
              <div className="mb-1 flex items-center justify-center">
                <img src={superHeroe} alt="Icono Héroe - SuperHéroe" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#fe5f55] mb-1 tracking-wide">HEROES</h3>
              <ul className="text-gray-700 text-xs space-y-0.5 list-none p-0 mb-3">
                <li>Sesiones personalizadas con seguimiento terapéutico real</li>
                <li>Todo lo del nivel anterior</li>
                <li>Hoja de ruta normativa ajustada según avance personal</li>
              </ul>
              <button className="mt-auto border-2 border-[#fe5f55] text-[#fe5f55] px-3 py-0.5 rounded-full font-bold bg-white hover:bg-[#fe5f55] hover:text-white transition-colors shadow-sm text-xs">Adquirir</button>
            </div>
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-[#1a3a2b]/10 via-[#1a3a2b]/30 to-[#1a3a2b]/10 mt-12"></div>
      </section>

      {/* --------------------------- SECCIÓN GLOBAL DE BENEFICIOS Y TERAPIA --------------------------- */}
      <section id="beneficios-seccion" className="w-full py-16 bg-[#f7fafc]">
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full mb-10 px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#e0e7ef] to-[#c7d2fe] shadow p-6 rounded-none">
            <p className="text-lg md:text-xl font-semibold text-[#1a3a2b] text-center">Terapia emocional profesional</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-white shadow p-6 border border-blue-100 rounded-none">
            <h3 className="text-2xl font-extrabold text-[#1a3a2b] mb-2 tracking-widest">ISEKAI</h3>
            <p className="text-gray-700 text-base text-center">Tu espacio para el bienestar emocional. Descubre herramientas, recursos y acompañamiento profesional para mejorar tu salud mental.</p>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a3a2b] mb-8 tracking-wide">Beneficios</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
          <div className="flex-1 bg-white shadow p-6 flex items-center justify-center border border-blue-100 rounded-none">
            <p className="text-gray-700 text-base text-center">Acompañamiento emocional flexible y adaptado al ritmo de cada usuario</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex items-center justify-center border border-blue-100">
            <p className="text-gray-700 text-base text-center">Educación emocional accesible, divertida y visualmente atractiva</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex items-center justify-center border border-blue-100">
            <p className="text-gray-700 text-base text-center">Un entorno seguro que combina apoyo profesional y lenguaje narrativo inmersivo</p>
          </div>
        </div>
      </section>

      {/* --------------------------- SECCIÓN VIAJE EMOCIONAL --------------------------- */}
      <section className="w-full py-16 bg-gradient-to-b from-[#e3e8ee] to-[#f7fafc]">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a3a2b] mb-8 tracking-wide">Beneficios del viaje emocional</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-700 text-lg text-center">Descubre el mapa de tu bienestar emocional y desbloquea logros a medida que avanzas. Cada paso te acerca a una mejor versión de ti mismo.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={mapaEmocional} alt="Mapa emocional" className="w-full max-w-xs md:max-w-md rounded-xl shadow-lg object-cover" />
          </div>
        </div>
      </section>

      {/* --------------------------- ICONOS CIRCULARES DE RECOMPENSAS (ABAJO) --------------------------- */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a3a2b] mb-8 tracking-wide px-4">CADA ACTIVIDAD QUE COMPLETES, TE DARÁ LAS SIGUIENTES RECOMPENSAS</h2> {/* Añadido padding horizontal aquí */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
          <div className="flex flex-col items-center p-0">
            <img src={caperucita} alt="Personajes Unicos" className="w-24 h-24 rounded-full shadow mb-2 object-cover" />
            <div className="text-[#1a3a2b] font-semibold text-lg">PERSONAJES ÚNICOS</div>
          </div>
          <div className="flex flex-col items-center">
            <img src={hidra} alt="Mascota Eterna" className="w-24 h-24 rounded-full shadow mb-2 object-cover" />
            <div className="text-[#1a3a2b] font-semibold text-lg">MASCOTA ETERNA</div>
          </div>
          <div className="flex flex-col items-center">
            <img src={fortuna} alt="Gemas" className="w-24 h-24 rounded-full shadow mb-2 object-cover" />
            <div className="text-[#1a3a2b] font-semibold text-lg">GEMAS</div>
          </div>
        </div>
      </section>

      {/* --------------------------- MISIÓN FINAL --------------------------- */}
      <section className="w-full py-16 bg-gradient-to-b from-[#e3e8ee] to-[#f7fafc] px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1a3a2b] mb-4 tracking-wide">¿Qué esperas para comenzar tu viaje emocional?</h2>
        <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto">Únete a ISekai y transforma tu bienestar emocional con ayuda profesional, recursos y comunidad.</p>
      </section>

      {/* --------------------------- FOOTER --------------------------- */}
      <footer id="contacto" className="w-full bg-[#1a3a2b] text-white py-8 px-4 md:px-8"> {/* Añadido padding horizontal aquí */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 p-0">
          <div className="text-center md:text-left">
            <strong>Contacto:</strong> contacto@isekai.com<br />
            <strong>Teléfono:</strong> +57 300 000 0000
          </div>
          <div className="flex gap-4 items-center justify-center">
            <a href="#" className="hover:scale-110 transition-transform"><img src={facebook} alt="Facebook" className="w-8 h-8" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><img src={instagram} alt="Instagram" className="w-8 h-8" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><img src={xIcon} alt="X (Twitter)" className="w-8 h-8" /></a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-300 mt-4">© 2025 ISekai. Todos los derechos reservados.</div>
      </footer>

      {/* --------------------------- MODAL DE LOGIN --------------------------- */}
      {showLoginModal && (
        <div className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="login-modal bg-white rounded-lg shadow-lg p-8 relative w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center mb-4">
              <span className="back-arrow text-2xl cursor-pointer mr-2" onClick={handleCloseModal}>&larr;</span>
              <h2 className="text-xl font-bold">Iniciar sesión</h2>
            </div>
            <form className="login-form flex flex-col gap-4">
              <div className="form-group">
                <input type="text" placeholder="Usuario" className="form-input w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Contraseña" className="form-input w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <button type="submit" className="login-button w-full bg-[#1a3a2b] text-white font-bold py-2 rounded hover:bg-[#17412a] transition-colors">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}