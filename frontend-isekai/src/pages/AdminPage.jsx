// frontend-isekai/src/pages/AdminPage.jsx
import React, { useState } from 'react';
import CrudManager from '../components/CrudManager/CrudManager';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css'; // Crearás este archivo CSS en el siguiente paso

// *** 1. Definición de la configuración para Logros ***
const logroConfig = {
    resourceName: 'logros',
    endpoint: 'crud/logros',
    columns: [
      { header: 'Nombre', accessor: 'nombre' },
      { header: 'Descripción', accessor: 'descripcion' },
      { header: 'Activo', accessor: resource => resource.isActive ? 'Sí' : 'No' },
      { header: 'Tipo de Criterio', accessor: resource => resource.criterio?.tipo },
      { header: 'Valor de Criterio', accessor: resource => resource.criterio?.valor },
      { header: 'Recompensa', accessor: 'recompensa' }
    ],
    fields: [
        { name: 'nombre', label: 'Nombre del Logro', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, rows: 4 },
        { name: 'criterio.tipo', label: 'Criterio - Tipo', type: 'select', options: ['terapiasCompletadas', 'nivelAlcanzado', 'xpAcumulado'], required: true },
        { name: 'criterio.valor', label: 'Criterio - Valor', type: 'number', required: true, min: 1 },
        { name: 'recompensa', label: 'Recompensa', type: 'text', optional: true, placeholder: 'Ej: insignia, título' },
    ],
    initialValues: {
        nombre: '',
        descripcion: '',
        'criterio.tipo': 'terapiasCompletadas',
        'criterio.valor': 1,
        recompensa: 'insignia',
    },
};

// *** 2. Definición de la configuración para Terapias ***
const terapiaConfig = {
    resourceName: 'terapias',
    endpoint: 'crud/terapias',
    columns: [
      { header: 'Nombre', accessor: 'nombre' },
      { header: 'Descripción', accessor: 'descripcion' },
      { header: 'Duración', accessor: resource => `${resource.duracionMinutos} min` },
      { header: 'Tipo', accessor: 'tipo' },
      { header: 'Costo', accessor: 'costo' },
      { header: 'Activo', accessor: resource => resource.isActive ? 'Sí' : 'No' }
    ],
    fields: [
        { name: 'nombre', label: 'Nombre de la Terapia', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, rows: 4 },
        { name: 'duracionMinutos', label: 'Duración (minutos)', type: 'number', required: true, min: 5 },
        { name: 'tipo', label: 'Tipo de Terapia', type: 'select', options: ['cognitivo-conductual', 'mindfulness', 'psicoanalisis', 'gestalt'], required: true },
        { name: 'costo', label: 'Costo', type: 'number', required: true, min: 0 },
        { name: 'isActive', label: 'Activa', type: 'checkbox', optional: true },
    ],
    initialValues: {
        nombre: '',
        descripcion: '',
        duracionMinutos: 30,
        tipo: 'cognitivo-conductual',
        costo: 0,
        isActive: true,
    },
};

// *** 3. Definición de la configuración para Desafios (asumiendo tu modelo) ***
const desafioConfig = {
    resourceName: 'desafios',
    endpoint: 'crud/desafios', // Debe coincidir con el backend
    fields: [
        { name: 'nombre', label: 'Nombre del Desafío', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, rows: 4 },
        { name: 'puntosXP', label: 'Puntos XP', type: 'number', required: true, min: 1 },
        { name: 'fechaCreacion', label: 'Fecha de Creación', type: 'date', required: true }, // Campo de fecha
        { name: 'isActive', label: 'Activo', type: 'checkbox', optional: true },
    ],
    columns: [
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Descripción', accessor: 'descripcion' },
        { header: 'Puntos XP', accessor: 'puntosXP' },
        { header: 'Fecha', accessor: (row) => new Date(row.fechaCreacion).toLocaleDateString() }, // Formato de fecha
        { header: 'Activo', accessor: (row) => (row.isActive ? 'Sí' : 'No') },
    ],
    initialValues: {
        nombre: '',
        descripcion: '',
        puntosXP: 100,
        fechaCreacion: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        isActive: true,
    },
};

// *** 4. Definición de la configuración para Actividades (asumiendo tu modelo) ***
const actividadConfig = {
    resourceName: 'actividades',
    endpoint: 'crud/actividades', // Asegúrate que el endpoint coincida con tu backend
    fields: [
        { name: 'nombre', label: 'Nombre de la Actividad', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, rows: 4 },
        { name: 'tipo', label: 'Tipo de Actividad', type: 'select', options: ['ejercicio', 'meditacion', 'lectura', 'escritura'], required: true },
        { name: 'duracionMinutos', label: 'Duración (minutos)', type: 'number', required: true, min: 1 },
        { name: 'puntosXP', label: 'Puntos XP', type: 'number', required: true, min: 1 },
        { name: 'urlRecurso', label: 'URL del Recurso', type: 'text', optional: true, placeholder: 'Ej: link a video o audio' },
    ],
    columns: [
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Tipo', accessor: 'tipo' },
        { header: 'Duración', accessor: (row) => `${row.duracionMinutos} min` },
        { header: 'Puntos XP', accessor: 'puntosXP' },
        { 
            header: 'Recurso', 
            accessor: (row) => row.urlRecurso ? <a href={row.urlRecurso} target="_blank" rel="noopener noreferrer">Ver</a> : 'N/A' 
        },
    ],
    initialValues: {
        nombre: '',
        descripcion: '',
        tipo: 'ejercicio',
        duracionMinutos: 15,
        puntosXP: 50,
        urlRecurso: '',
    },
};



function AdminPage() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('logros'); // Estado para controlar la pestaña activa

    const renderCrudManager = () => {
        switch (selectedTab) {
            case 'logros':
                return <CrudManager {...logroConfig} />;
            case 'terapias':
                return <CrudManager {...terapiaConfig} />;
            case 'desafios':
                return <CrudManager {...desafioConfig} />;
            case 'actividades':
                return <CrudManager {...actividadConfig} />;
            default:
                return <p>Selecciona una opción para administrar.</p>;
        }
    };

    return (
        <div className="admin-page-container">
            <h1>Panel de Administración</h1>

            <div className="admin-tabs">
                <button 
                    className={`tab-button ${selectedTab === 'logros' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('logros')}
                >
                    Logros
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'terapias' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('terapias')}
                >
                    Terapias
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'desafios' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('desafios')}
                >
                    Desafíos Diarios
                </button>
                <button 
                    className={`tab-button ${selectedTab === 'actividades' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('actividades')}
                >
                    Actividades
                </button>
            </div>

            <div className="admin-content">
                {renderCrudManager()}
            </div>

            <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-button">
                Volver al Dashboard
            </button>
        </div>
    );
}

export default AdminPage;