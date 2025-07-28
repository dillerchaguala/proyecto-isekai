// frontend-isekai/src/pages/CrearActividad.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importa un CSS si lo deseas, por ahora no es necesario
// import './CrearActividad.css';

function CrearActividad() {
    const navegar = useNavigate();

    return (
        <div className="crear-actividad-container">
            <h2>Crear Nueva Actividad (En Construcción)</h2>
            <p>Aquí se creará el formulario para las actividades.</p>
            <button onClick={() => navegar('/dashboard')} className="back-button">
                Volver al Dashboard
            </button>
        </div>
    );
}

export default CrearActividad;