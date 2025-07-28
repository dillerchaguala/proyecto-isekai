// frontend-isekai/src/pages/CrearDesafio.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importa un CSS si lo deseas, por ahora no es necesario
// import './CrearDesafio.css';

function CrearDesafio() {
    const navegar = useNavigate();

    return (
        <div className="crear-desafio-container">
            <h2>Crear Nuevo Desafío Diario (En Construcción)</h2>
            <p>Aquí se creará el formulario para los desafíos diarios.</p>
            <button onClick={() => navegar('/dashboard')} className="back-button">
                Volver al Dashboard
            </button>
        </div>
    );
}

export default CrearDesafio;