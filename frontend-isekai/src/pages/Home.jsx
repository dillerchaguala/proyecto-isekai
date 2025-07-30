import React from 'react';
import fondo from '../assets/fondoTitulo.jpeg';
import mochila from '../assets/mochila.png';
import sombrero from '../assets/sombrero.png';
import heroe from '../assets/superHeroe.png'; // nombre corregido
import { FaCalendarCheck, FaUsers, FaTrophy } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Sección del fondo */}
      <section
        className="w-screen h-[500px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <h1 className="text-6xl font-bold text-yellow-400 absolute top-10 left-1/2 transform -translate-x-1/2">
          ISEKAI
        </h1>
        <p className="text-yellow-400 text-xl absolute top-28 left-1/2 transform -translate-x-1/2">
          TERAPIA GAMIFICADA
        </p>

        {/* Íconos flotantes en la derecha */}
        <div className="absolute right-6 top-1/3 flex flex-col items-center space-y-6 text-white text-sm">
          <div className="flex flex-col items-center">
            <FaCalendarCheck size={28} />
            <span className="mt-1">Agendar cita</span>
          </div>
          <div className="flex flex-col items-center">
            <FaUsers size={28} />
            <span className="mt-1">Tipos de terapia</span>
          </div>
          <div className="flex flex-col items-center">
            <FaTrophy size={28} />
            <span className="mt-1">Actividades</span>
          </div>
        </div>
      </section>

      {/* Niveles de acceso */}
      <section className="w-full py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">NIVELES DE ACCESO</h2>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {/* Explorador */}
          <div className="w-64 rounded-2xl shadow-md hover:shadow-xl transition bg-white p-4 flex flex-col items-center">
            <img src={sombrero} alt="Explorador - Sombrero" className="w-28 h-28 mb-4" />
            <h3 className="text-lg font-bold">Explorador</h3>
            <p className="text-sm text-gray-600 text-center">
              Accede a contenido básico y sesiones introductorias.
            </p>
          </div>

          {/* Aventurero */}
          <div className="w-64 rounded-2xl shadow-md hover:shadow-xl transition bg-white p-4 flex flex-col items-center">
            <img src={mochila} alt="Aventurero - Mochila" className="w-28 h-28 mb-4" />
            <h3 className="text-lg font-bold">Aventurero</h3>
            <p className="text-sm text-gray-600 text-center">
              Participa en terapias grupales y retos personales.
            </p>
          </div>

          {/* Héroe */}
          <div className="w-64 rounded-2xl shadow-md hover:shadow-xl transition bg-white p-4 flex flex-col items-center">
            <img src={heroe} alt="Héroe - Superhéroe" className="w-28 h-28 mb-4" />
            <h3 className="text-lg font-bold">Héroe</h3>
            <p className="text-sm text-gray-600 text-center">
              Acceso completo a todas las funcionalidades y terapias.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
