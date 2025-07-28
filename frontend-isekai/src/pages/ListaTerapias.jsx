// frontend-isekai/src/pages/ListaTerapias.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './ListaTerapias.module.css'; // Crearemos este archivo de estilos después

function ListaTerapias() {
    const [terapias, setTerapias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const navegar = useNavigate();

    useEffect(() => {
        const obtenerTerapias = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navegar('/iniciar-sesion'); // Redirige si no hay token
                    return;
                }

                const respuesta = await fetch('http://localhost:5000/api/terapias', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Envía el token de autenticación
                    },
                });

                const datos = await respuesta.json();

                if (respuesta.ok) {
                    setTerapias(datos);
                } else {
                    setError(datos.message || 'Error al cargar las terapias.');
                }
            } catch (err) {
                console.error('Error de red al obtener terapias:', err);
                setError('No se pudo conectar al servidor para obtener las terapias.');
            } finally {
                setCargando(false);
            }
        };

        obtenerTerapias();
    }, [navegar]); // Dependencia para asegurar que useNavigate no cause bucles

    if (cargando) {
        return <div className={estilos.contenedorCarga}>Cargando terapias...</div>;
    }

    if (error) {
        return <div className={estilos.mensajeError}>{error}</div>;
    }

    return (
        <div className={estilos.contenedorListaTerapias}>
            <h1>Terapias Disponibles</h1>
            {terapias.length === 0 ? (
                <p>No hay terapias disponibles en este momento.</p>
            ) : (
                <ul className={estilos.lista}>
                    {terapias.map((terapia) => (
                        <li key={terapia._id} className={estilos.itemTerapia}>
                            <h3>{terapia.titulo}</h3>
                            <p>{terapia.descripcion}</p>
                            <p><strong>Tipo:</strong> {terapia.tipo}</p>
                            <p><strong>Nivel Requerido:</strong> {terapia.nivelRequerido}</p>
                            <p><strong>Recompensa XP:</strong> {terapia.recompensaXP}</p>
                            {/* Aquí podrías añadir un botón para "Ver Detalles" o "Iniciar Terapia" */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaTerapias;