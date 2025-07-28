// frontend-isekai/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './Dashboard.module.css'; // Asegúrate de que este archivo CSS exista o créalo

function Dashboard() {
    const navegar = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            const parsedUsuario = JSON.parse(usuarioGuardado);
            setUsuario(parsedUsuario);
            // *** IMPORTANTE: Eliminamos la redirección inmediata para pacientes aquí ***
            // La lógica ahora solo verifica si hay un usuario logueado.
            // La redirección específica para paciente a /perfil ya NO ESTÁ AQUÍ.
            // Si el paciente debe ir directamente a perfil, esta línea debería estar aquí:
            // if (parsedUsuario.rol === 'paciente') {
            //     navegar('/perfil');
            // }
            // Pero para que el paciente vea SU dashboard, la quitamos.
        } else {
            console.log("DEBUG Dashboard: No hay usuario en localStorage, redirigiendo a /iniciar-sesion.");
            navegar('/iniciar-sesion'); // Si no hay usuario, redirige a login
        }
        setCargando(false);
    }, [navegar]);

    if (cargando) {
        return <div className={estilos.contenedorCarga}>Cargando dashboard...</div>;
    }

    if (!usuario) {
        return null; // Ya se redirigió al login
    }

    // Contenido del dashboard
    return (
        <div className={estilos.contenedorDashboard}>
            <h1>Bienvenido, {usuario.nombreUsuario}!</h1>
            <p>Tu Rol: {usuario.rol}</p>

            {/* Opciones para Administradores y Terapeutas */}
            {(usuario.rol === 'administrador' || usuario.rol === 'terapeuta') && (
                <div className={estilos.seccionAdminTerapeuta}>
                    <h2>Panel de Gestión</h2>
                    <ul className={estilos.listaOpciones}>
                        {/* Gestión de Terapias */}
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/terapias/crear')}
                            >
                                Crear Nueva Terapia
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/terapias')}
                            >
                                Ver Todas las Terapias
                            </button>
                        </li>

                        {/* Gestión de Logros */}
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/logros/crear')} // Ruta hipotética para crear logros
                            >
                                Crear Nuevo Logro
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/logros')} // Ruta hipotética para ver todos los logros
                            >
                                Ver Todos los Logros
                            </button>
                        </li>

                        {/* Gestión de Desafíos Diarios */}
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/desafios/crear')} // Ruta hipotética para crear desafíos
                            >
                                Crear Nuevo Desafío Diario
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/desafios')} // Ruta hipotética para ver todos los desafíos
                            >
                                Ver Todos los Desafíos
                            </button>
                        </li>

                        {/* Gestión de Actividades */}
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/actividades/crear')} // Ruta hipotética para crear actividades
                            >
                                Crear Nueva Actividad
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/actividades')} // Ruta hipotética para ver todas las actividades
                            >
                                Ver Todas las Actividades
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Opciones Específicas para Pacientes (AHORA VISIBLE) */}
            {usuario.rol === 'paciente' && (
                <div className={estilos.seccionPaciente}>
                    <h2>Tu Panel de Aventurero</h2>
                    <p>¡Bienvenido de nuevo a Isekai!</p>
                    <ul className={estilos.listaOpciones}>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/perfil')}
                            >
                                Ver mi Perfil de Aventurero
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/mis-terapias')} 
                            >
                                Ver mis Terapias Asignadas
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/explorar-logros')} 
                            >
                                Explorar Logros
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/desafios-disponibles')} 
                            >
                                Ver Desafíos Diarios
                            </button>
                        </li>
                        <li>
                            <button
                                className={estilos.botonOpcion}
                                onClick={() => navegar('/actividades-disponibles')} 
                            >
                                Ver Actividades Disponibles
                            </button>
                        </li>
                        {/* Agrega más opciones aquí para pacientes, como reservar citas, etc. */}
                    </ul>
                    <p className={estilos.mensajeBienvenida}>
                        Aquí puedes gestionar tus aventuras y ver tus progresos.
                    </p>
                </div>
            )}

            <button className={estilos.botonSalir} onClick={() => {
                localStorage.clear(); // Limpia todo lo de esta aplicación en localStorage
                navegar('/iniciar-sesion');
            }}>Cerrar Sesión</button>
        </div>
    );
}

export default Dashboard;