// src/pages/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
            <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-100 font-sans p-5">
                <p className="text-blue-600 text-xl font-bold">Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-100 font-sans p-5">
                <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
                <button onClick={manejarCerrarSesion} className="px-5 py-2 rounded bg-red-600 text-white text-base mt-2 font-semibold transition-colors duration-300 hover:bg-red-800">Volver a Iniciar Sesión</button>
            </div>
        );
    }

    if (!datosUsuario) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-100 font-sans p-5">
                <p className="text-red-600 text-lg font-semibold mb-4">No se pudo cargar la información del usuario.</p>
                <button onClick={manejarCerrarSesion} className="px-5 py-2 rounded bg-red-600 text-white text-base mt-2 font-semibold transition-colors duration-300 hover:bg-red-800">Volver a Iniciar Sesión</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-100 font-sans p-5">
            <div className="p-8 rounded-lg shadow-lg bg-white w-[400px] max-w-[90%] text-center">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Bienvenido, {datosUsuario.nombreUsuario}!</h2>
                <div className="mb-6 text-[1.1em] text-gray-800 leading-relaxed">
                    <p><span className="font-bold text-blue-800">Email:</span> {datosUsuario.email}</p>
                    <p><span className="font-bold text-blue-800">Rol:</span> {datosUsuario.rol}</p>
                    <p><span className="font-bold text-blue-800">Puntos de Experiencia (XP):</span> {datosUsuario.puntosExperiencia}</p>
                    <p><span className="font-bold text-blue-800">Nivel Actual:</span> {datosUsuario.nivelActual}</p>
                    <p><span className="font-bold text-blue-800">Terapias Completadas:</span> {datosUsuario.terapiasCompletadas ? datosUsuario.terapiasCompletadas.length : 0}</p>
                </div>
                <button onClick={manejarCerrarSesion} className="px-5 py-2 rounded bg-red-600 text-white text-base mt-2 font-semibold transition-colors duration-300 hover:bg-red-800">Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Perfil;