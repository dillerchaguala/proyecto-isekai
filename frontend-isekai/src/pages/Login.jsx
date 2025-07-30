// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navegar = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const respuesta = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contrasena }),
            });

            console.log("Respuesta del servidor recibida. Status:", respuesta.status); 

            
            let datos;
            try {
                // Verificar si la respuesta no está vacía antes de intentar parsear JSON
                // Esto es una mejora para evitar errores si el servidor envía una respuesta no-JSON en algún caso de error
                const contentType = respuesta.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    datos = await respuesta.json();
                } else {
                    // Si no es JSON, y no fue ok, asumir que fue un error sin un cuerpo JSON específico
                    console.log("DEBUG 4a: Respuesta no es JSON o está vacía.");
                    datos = { message: `Error (${respuesta.status}) o respuesta no JSON.` };
                }
            } catch (jsonError) {
                console.error("DEBUG 4b: Error al parsear JSON de la respuesta:", jsonError); 
                setError(`Error al procesar la respuesta del servidor: ${jsonError.message}`);
                return; // Detener la ejecución si el JSON no se puede parsear
            }

            console.log("Datos parseados de la respuesta:", datos); // DEBUG 5: Datos recibidos del backend

            if (respuesta.ok) { // Si la respuesta HTTP fue 2xx (ej. 200 OK)
                console.log('DEBUG 6: Login exitoso, almacenando token y usuario...'); 
                const token = datos.token || (datos.data && datos.data.token);
                localStorage.setItem('token', token);
                // Soportar diferentes formatos de respuesta del backend
                const userObj = datos.usuario || (datos.data && (datos.data.usuario || datos.data.user));
                if (userObj) {
                  localStorage.setItem('usuario', JSON.stringify(userObj));
                } else {
                  localStorage.removeItem('usuario');
                }
                console.log('DEBUG 7: Intentando navegar a /dashboard...'); 
                navegar('/dashboard'); 
                console.log('DEBUG 8: Navegación a /dashboard iniciada (esta línea puede no verse si la redirección es instantánea).'); 
            } else { // Si la respuesta HTTP no fue 2xx (ej. 400, 401, 500)
                console.log('DEBUG 9: Login fallido:', datos.message); 
                setError(datos.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (err) {
            console.error('DEBUG 10: Error CATCH general (red o inesperado):', err); 
            setError('No se pudo conectar al servidor o hubo un error inesperado. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-5">
            <div className="p-8 rounded-lg shadow-lg bg-white w-[350px] max-w-[90%] text-center">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
                <form onSubmit={manejarEnvio}>
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="block mb-1 font-bold text-gray-600">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2.5 mt-1 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="contrasena" className="block mb-1 font-bold text-gray-600">Contraseña:</label>
                        <input
                            type="password"
                            id="contrasena"
                            className="w-full p-2.5 mt-1 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
                    <button type="submit" className="w-full py-3 rounded bg-blue-600 text-white text-base font-semibold cursor-pointer mt-2 transition-colors duration-300 hover:bg-blue-800">Iniciar Sesión</button>
                </form>
                <p className="mt-5 text-sm text-gray-600">
                    ¿No tienes cuenta? <a href="/registro" className="text-blue-600 font-bold hover:underline">Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}

export default Login;