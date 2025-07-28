// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './Registro.module.css'; // Importa los estilos modulares

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
        <div className={estilos.contenedorRegistro}>
            <div className={estilos.tarjetaRegistro}>
                <h2>Registrarse</h2>
                <form onSubmit={manejarEnvio}>
                    <div className={estilos.grupoInput}>
                        <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="nombreUsuario"
                            className={estilos.inputCampo}
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className={estilos.grupoInput}>
                        <label htmlFor="confirmarContrasena">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmarContrasena"
                            className={estilos.inputCampo}
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className={estilos.mensajeError}>{error}</p>}
                    {exito && <p className={estilos.mensajeExito}>{exito}</p>} {/* Mensaje de éxito */}
                    <button type="submit" className={estilos.botonPrincipal}>Registrarse</button>
                </form>
                <p className={estilos.textoLogin}>
                    ¿Ya tienes cuenta? <a href="/iniciar-sesion" className={estilos.enlaceLogin}>Iniciar Sesión</a>
                </p>
            </div>
        </div>
    );
}

export default Registro;