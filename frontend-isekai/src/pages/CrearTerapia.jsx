// frontend-isekai/src/pages/CrearTerapia.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './CrearTerapia.module.css'; // Asegúrate de que este archivo exista y contenga los estilos

function CrearTerapia() {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [nivelRequerido, setNivelRequerido] = useState('');
    const [puntosXP, setPuntosXP] = useState(''); // CAMBIO: De recompensaXP a puntosXP
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const navegar = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión.');
            navegar('/iniciar-sesion');
            return;
        }

        const usuarioInfo = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioInfo || (usuarioInfo.rol !== 'terapeuta' && usuarioInfo.rol !== 'administrador')) {
            setError('No tienes permiso para crear terapias.');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:5000/api/terapias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // CAMBIO: Ahora enviamos 'puntosXP'
                body: JSON.stringify({ titulo, descripcion, tipo, nivelRequerido, puntosXP }),
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                setMensajeExito('Terapia creada exitosamente!');
                // Limpiar formulario
                setTitulo('');
                setDescripcion('');
                setTipo('');
                setNivelRequerido('');
                setPuntosXP(''); // CAMBIO: Limpiamos 'puntosXP'
                // Opcional: Redirigir a la lista de terapias después de un breve momento
                // setTimeout(() => navegar('/terapias'), 2000); 
            } else {
                setError(datos.message || 'Error al crear la terapia.');
            }
        } catch (err) {
            console.error('Error de red al crear terapia:', err);
            setError('No se pudo conectar al servidor para crear la terapia.');
        }
    };

    return (
        <div className={estilos.contenedorFormulario}>
            <h2>Crear Nueva Terapia</h2>
            <form onSubmit={manejarEnvio} className={estilos.formulario}>
                <div className={estilos.grupoInput}>
                    <label htmlFor="titulo">Título:</label>
                    <input
                        type="text"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        className={estilos.inputCampo}
                    />
                </div>
                <div className={estilos.grupoInput}>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        className={estilos.textAreaCampo}
                    ></textarea>
                </div>
                <div className={estilos.grupoInput}>
                    <label htmlFor="tipo">Tipo:</label>
                    <input
                        type="text"
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                        className={estilos.inputCampo}
                    />
                </div>
                <div className={estilos.grupoInput}>
                    <label htmlFor="nivelRequerido">Nivel Requerido:</label>
                    <input
                        type="number"
                        id="nivelRequerido"
                        value={nivelRequerido}
                        onChange={(e) => setNivelRequerido(e.target.value)}
                        required
                        className={estilos.inputCampo}
                    />
                </div>
                <div className={estilos.grupoInput}>
                    {/* CAMBIO: Label y ID para 'puntosXP' */}
                    <label htmlFor="puntosXP">Puntos de Experiencia (XP):</label>
                    <input
                        type="number"
                        id="puntosXP" // CAMBIO: ID a 'puntosXP'
                        value={puntosXP} // CAMBIO: Usar 'puntosXP'
                        onChange={(e) => setPuntosXP(e.target.value)} // CAMBIO: Actualizar 'puntosXP'
                        required
                        className={estilos.inputCampo}
                    />
                </div>
                {error && <p className={estilos.mensajeError}>{error}</p>}
                {mensajeExito && <p className={estilos.mensajeExito}>{mensajeExito}</p>}
                <button type="submit" className={estilos.botonPrincipal}>Crear Terapia</button>
            </form>
        </div>
    );
}

export default CrearTerapia;