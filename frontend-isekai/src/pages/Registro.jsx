// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState(''); // Para mensajes de éxito
    const navegar = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (contrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombreUsuario, email, contrasena }),
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                setExito(datos.message || '¡Registro exitoso! Ya puedes iniciar sesión.');
                // Opcional: Redirigir al usuario al login después de un breve retraso
                setTimeout(() => {
                    navegar('/iniciar-sesion');
                }, 2000); // Redirige después de 2 segundos
            } else {
                setError(datos.message || 'Error al registrar el usuario.');
            }
        } catch (err) {
            console.error('Error de red al registrar:', err);
            setError('No se pudo conectar al servidor. Inténtalo de nuevo más tarde.');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 font-sans p-5">
            <div className="p-8 rounded-lg shadow-xl bg-white w-[400px] max-w-[90%] text-center">
                <h2 className="mb-6 text-2xl font-bold text-blue-900">Registrarse</h2>
                <form onSubmit={manejarEnvio}>
                    <div className="mb-5 text-left">
                        <label htmlFor="nombreUsuario" className="block mb-1 font-bold text-blue-800 text-[0.95em]">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="nombreUsuario"
                            className="w-full p-3 rounded border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5 text-left">
                        <label htmlFor="email" className="block mb-1 font-bold text-blue-800 text-[0.95em]">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 rounded border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5 text-left">
                        <label htmlFor="contrasena" className="block mb-1 font-bold text-blue-800 text-[0.95em]">Contraseña:</label>
                        <input
                            type="password"
                            id="contrasena"
                            className="w-full p-3 rounded border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5 text-left">
                        <label htmlFor="confirmarContrasena" className="block mb-1 font-bold text-blue-800 text-[0.95em]">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmarContrasena"
                            className="w-full p-3 rounded border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 mt-4 text-[0.95em] font-medium">{error}</p>}
                    {exito && <p className="text-green-600 mt-4 text-[0.95em] font-medium">{exito}</p>}
                    <button type="submit" className="w-full py-3 rounded bg-green-600 text-white text-lg font-bold cursor-pointer mt-4 transition-colors duration-300 hover:bg-green-800 active:translate-y-0.5">Registrarse</button>
                </form>
                <p className="mt-7 text-sm text-gray-500">
                    ¿Ya tienes cuenta? <a href="/iniciar-sesion" className="text-blue-600 font-bold hover:underline">Inicia sesión aquí</a>
                </p>
            </div>
        </div>
    );
}

export default Registro;