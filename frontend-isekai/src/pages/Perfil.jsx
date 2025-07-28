// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './Perfil.module.css'; // Importa los estilos modulares

function Perfil() {
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const navegar = useNavigate();

    useEffect(() => {
        const obtenerPerfilUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navegar('/iniciar-sesion'); // Si no hay token, redirigir al login
                return;
            }

            try {
                const respuesta = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Enviar el token en los headers
                    },
                });

                const datos = await respuesta.json();

                if (respuesta.ok) {
                    setDatosUsuario(datos); // Guardar los datos del usuario en el estado
                    console.log('Perfil del usuario cargado:', datos);
                } else {
                    setError(datos.message || 'Error al cargar el perfil.');
                    if (respuesta.status === 401) { // Token inválido o expirado
                        manejarCerrarSesion();
                    }
                }
            } catch (err) {
                console.error('Error de red al cargar el perfil:', err);
                setError('No se pudo conectar al servidor para cargar el perfil.');
            } finally {
                setCargando(false);
            }
        };

        obtenerPerfilUsuario();
    }, [navegar]);

    const manejarCerrarSesion = () => {
        localStorage.removeItem('token'); // Eliminar el token
        localStorage.removeItem('usuario'); // Eliminar cualquier info de usuario guardada
        navegar('/iniciar-sesion'); // Redirigir a la página de inicio de sesión
    };

    if (cargando) {
        return (
            <div className={estilos.contenedorPerfil}>
                <p className={estilos.mensajeCargando}>Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={estilos.contenedorPerfil}>
                <p className={estilos.mensajeError}>{error}</p>
                <button onClick={manejarCerrarSesion} className={estilos.botonCerrarSesion}>Volver a Iniciar Sesión</button>
            </div>
        );
    }

    if (!datosUsuario) {
        return (
            <div className={estilos.contenedorPerfil}>
                <p className={estilos.mensajeError}>No se pudo cargar la información del usuario.</p>
                <button onClick={manejarCerrarSesion} className={estilos.botonCerrarSesion}>Volver a Iniciar Sesión</button>
            </div>
        );
    }

    return (
        <div className={estilos.contenedorPerfil}>
            <div className={estilos.tarjetaPerfil}>
                <h2>Bienvenido, {datosUsuario.nombreUsuario}!</h2>
                <div className={estilos.infoUsuario}>
                    <p><strong>Email:</strong> {datosUsuario.email}</p>
                    <p><strong>Rol:</strong> {datosUsuario.rol}</p>
                    <p><strong>Puntos de Experiencia (XP):</strong> {datosUsuario.puntosExperiencia}</p>
                    <p><strong>Nivel Actual:</strong> {datosUsuario.nivelActual}</p>
                    <p><strong>Terapias Completadas:</strong> {datosUsuario.terapiasCompletadas ? datosUsuario.terapiasCompletadas.length : 0}</p>
                </div>
                <button onClick={manejarCerrarSesion} className={estilos.botonCerrarSesion}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Perfil;