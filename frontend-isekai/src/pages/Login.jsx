// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './Login.module.css';

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
                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));
                
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
        <div className={estilos.contenedorLogin}>
            <div className={estilos.tarjetaLogin}>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={manejarEnvio}>
                    <div className={estilos.grupoInput}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={estilos.inputCampo}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={estilos.grupoInput}>
                        <label htmlFor="contrasena">Contraseña:</label>
                        <input
                            type="password"
                            id="contrasena"
                            className={estilos.inputCampo}
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className={estilos.mensajeError}>{error}</p>}
                    <button type="submit" className={estilos.botonPrincipal}>Iniciar Sesión</button>
                </form>
                <p className={estilos.textoRegistro}>
                    ¿No tienes cuenta? <a href="/registro" className={estilos.enlaceRegistro}>Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}

export default Login;