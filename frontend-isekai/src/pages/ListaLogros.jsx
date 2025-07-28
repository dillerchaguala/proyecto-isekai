// frontend-isekai/src/pages/ListaLogros.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaLogros.css'; // Asegúrate de que este archivo CSS existe

function ListaLogros() {
    const [logros, setLogros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null); // Para mensajes de éxito después de operaciones
    const navegar = useNavigate();

    // Función para obtener los logros desde el backend
    // Se extrae para poder ser llamada después de eliminar un logro
    const fetchLogros = async () => {
        setCargando(true); // Siempre que se inicie un fetch, ponemos cargando a true
        setError(null);    // Limpiamos errores anteriores
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Si no hay token, redirigimos al login (o manejamos acceso no autorizado)
                navegar('/iniciar-sesion');
                return;
            }

            const response = await fetch('http://localhost:5000/api/logros', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluye el token de autorización
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener los logros.');
            }

            const data = await response.json();
            // Asegúrate de acceder a `data.data.logros` si tu backend devuelve { status: 'success', data: { logros: [...] } }
            setLogros(data.data.logros);
        } catch (err) {
            console.error('Error al cargar logros:', err);
            setError(err.message || 'Ocurrió un error inesperado al cargar los logros.');
        } finally {
            setCargando(false); // Siempre que termina el fetch, ponemos cargando a false
        }
    };

    // useEffect para cargar los logros la primera vez que el componente se monta
    useEffect(() => {
        fetchLogros();
    }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar

    // Función para manejar la eliminación de un logro
    const manejarEliminarLogro = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este logro? Esta acción es irreversible.')) {
            return; // Si el usuario cancela, no hacemos nada
        }

        setCargando(true); // Opcional: para deshabilitar botones mientras se elimina
        setError(null);
        setMensajeExito(null); // Limpiar mensaje de éxito anterior

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navegar('/iniciar-sesion');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/logros/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Token de autorización para eliminar
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el logro.');
            }

            // Si la eliminación fue exitosa (el backend devuelve 204 No Content),
            // no habrá cuerpo en la respuesta.
            setMensajeExito('Logro eliminado exitosamente.');
            // *** RESPUESTA A TU PREGUNTA: ACTUALIZACIÓN AUTOMÁTICA ***
            // Para que la lista se actualice automáticamente, volvemos a llamar a fetchLogros().
            // Esto obtiene la lista más reciente de la base de datos.
            fetchLogros(); 

        } catch (err) {
            console.error('Error al eliminar logro:', err);
            setError(err.message || 'Ocurrió un error al eliminar el logro.');
        } finally {
            setCargando(false);
            // Opcional: limpiar mensajes de estado después de un tiempo
            setTimeout(() => {
                setMensajeExito(null);
                setError(null);
            }, 3000); // El mensaje desaparece después de 3 segundos
        }
    };

    // Función para manejar la edición de un logro
    const manejarEditarLogro = (id) => {
        // Redirigir a la página de edición, pasando el ID del logro en la URL
        // La página EditarLogro.jsx usará este ID para cargar los datos
        navegar(`/logros/editar/${id}`);
    };


    if (cargando && logros.length === 0 && !error) { // Mostrar cargando solo al inicio si la lista está vacía
        return <div className="lista-logros-container">Cargando logros...</div>;
    }

    if (error) {
        return (
            <div className="lista-logros-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchLogros} className="retry-button">Reintentar Cargar Logros</button>
            </div>
        );
    }

    return (
        <div className="lista-logros-container">
            <h2>Todos los Logros</h2>
            {mensajeExito && <p className="success-message">{mensajeExito}</p>} {/* Mostrar mensaje de éxito */}

            {logros.length === 0 ? (
                <p>No hay logros creados aún. ¡Crea uno!</p>
            ) : (
                <ul className="logros-lista">
                    {logros.map((logro) => (
                        <li key={logro._id} className="logro-item">
                            {/* Detalles del logro */}
                            <div className="logro-info">
                                <h3>{logro.nombre}</h3>
                                <p>{logro.descripcion}</p>
                                <p><strong>Criterio:</strong> {logro.criterio.tipo} = {logro.criterio.valor}</p>
                                {logro.icono && <img src={logro.icono} alt="Icono de logro" className="logro-icono" />}
                                <p><strong>Recompensa:</strong> {logro.recompensa}</p>
                            </div>

                            {/* Botones de acción */}
                            <div className="logro-acciones">
                                <button
                                    className="edit-button"
                                    onClick={() => manejarEditarLogro(logro._id)}
                                    disabled={cargando} // Deshabilitar si está cargando/procesando
                                >
                                    Editar
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => manejarEliminarLogro(logro._id)}
                                    disabled={cargando} // Deshabilitar si está cargando/procesando
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navegar('/dashboard')} className="back-button">
                Volver al Dashboard
            </button>
        </div>
    );
}

export default ListaLogros;