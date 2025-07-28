// frontend-isekai/src/components/CrudManager/CrudManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrudManager.css'; 

// Importa los componentes internos
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';

function CrudManager({ resourceName, endpoint, fields, columns, initialValues }) {
    const [resources, setResources] = useState([]); // Lista de recursos (logros, terapias, etc.)
    const [currentResource, setCurrentResource] = useState(null); // Recurso actualmente en edición
    const [isCreating, setIsCreating] = useState(false); // Si estamos en modo de creación
    const [cargando, setCargando] = useState(false); // Estado de carga para operaciones
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);
    const navigate = useNavigate();

    const apiUrl = `http://localhost:5000/api/${endpoint}`;

    // --- Funciones para la API ---

    // Función para obtener todos los recursos
    const fetchResources = async () => {
        setCargando(true);
        setError(null);
        setMensajeExito(null); // Limpiar mensajes al recargar
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/iniciar-sesion');
                return;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al obtener ${resourceName}.`);
            }

            const data = await response.json();
            // Asumiendo que tu backend devuelve { status: 'success', data: { [endpoint]: [] } }
            // Donde [endpoint] sería 'logros', 'terapias', etc.
            // Asegúrate de que `data.data` contiene una propiedad con el nombre de tu `endpoint`
            setResources(data.data[endpoint]); 
        } catch (err) {
            console.error(`Error al cargar ${resourceName}:`, err);
            setError(err.message || `Ocurrió un error inesperado al cargar los ${resourceName}.`);
        } finally {
            setCargando(false);
        }
    };

    // useEffect para cargar los recursos al montar el componente
    useEffect(() => {
        fetchResources();
    }, [endpoint, navigate]); // Añadir navigate a deps para evitar warnings

    // Función para crear un recurso
    const handleCreate = async (formData) => {
        setCargando(true);
        setError(null);
        setMensajeExito(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) { // Verificar token antes de la llamada
                setError('No autorizado: Token no encontrado.');
                setCargando(false);
                return;
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al crear ${resourceName}.`);
            }

            setMensajeExito(`¡${resourceName.slice(0, -1)} creado exitosamente!`); // Quita la 's' final
            setIsCreating(false); // Salir del modo creación
            fetchResources(); // Recargar la lista
            
        } catch (err) {
            console.error(`Error al crear ${resourceName}:`, err);
            setError(err.message || `Ocurrió un error al crear el ${resourceName}.`);
        } finally {
            setCargando(false);
            setTimeout(() => { setError(null); setMensajeExito(null); }, 3000); // Limpiar mensajes
        }
    };

    // Función para actualizar un recurso
    const handleUpdate = async (formData) => { // El ID del recurso a actualizar se toma de currentResource._id
        setCargando(true);
        setError(null);
        setMensajeExito(null);
        try {
            const token = localStorage.getItem('token');
             if (!token) { // Verificar token antes de la llamada
                setError('No autorizado: Token no encontrado.');
                setCargando(false);
                return;
            }
            // Asegurarse de que currentResource._id existe para la actualización
            if (!currentResource || !currentResource._id) {
                throw new Error('No se encontró el ID del recurso para actualizar.');
            }
            const response = await fetch(`${apiUrl}/${currentResource._id}`, {
                method: 'PATCH', // Asumimos PATCH para actualizaciones parciales
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al actualizar ${resourceName}.`);
            }

            setMensajeExito(`¡${resourceName.slice(0, -1)} actualizado exitosamente!`);
            setCurrentResource(null); // Salir del modo edición
            fetchResources(); // Recargar la lista
            
        } catch (err) {
            console.error(`Error al actualizar ${resourceName}:`, err);
            setError(err.message || `Ocurrió un error al actualizar el ${resourceName}.`);
        } finally {
            setCargando(false);
            setTimeout(() => { setError(null); setMensajeExito(null); }, 3000); // Limpiar mensajes
        }
    };

    // Función para eliminar un recurso
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar este ${resourceName.slice(0, -1)}? Esta acción es irreversible.`)) {
            return;
        }

        setCargando(true);
        setError(null);
        setMensajeExito(null);
        try {
            const token = localStorage.getItem('token');
             if (!token) { // Verificar token antes de la llamada
                setError('No autorizado: Token no encontrado.');
                setCargando(false);
                return;
            }
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al eliminar ${resourceName}.`);
            }

            setMensajeExito(`¡${resourceName.slice(0, -1)} eliminado exitosamente!`);
            fetchResources(); // Recargar la lista
            
        } catch (err) {
            console.error(`Error al eliminar ${resourceName}:`, err);
            setError(err.message || `Ocurrió un error al eliminar el ${resourceName}.`);
        } finally {
            setCargando(false);
            setTimeout(() => { setError(null); setMensajeExito(null); }, 3000); // Limpiar mensajes
        }
    };

    // --- Funciones para cambiar el modo (Crear, Editar, Listar) ---

    const handleEditClick = (resource) => {
        setCurrentResource(resource);
        setIsCreating(false);
        setError(null); // Limpiar errores al cambiar de modo
        setMensajeExito(null);
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setCurrentResource(null);
        setError(null); // Limpiar errores al cambiar de modo
        setMensajeExito(null);
    };

    const handleCancelForm = () => {
        setIsCreating(false);
        setCurrentResource(null);
        setError(null);
        setMensajeExito(null);
    };


    // --- Renderizado Condicional ---
    return (
        <div className="crud-manager-container">
            <h3>Gestión de {resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}</h3> {/* Capitaliza el nombre */}
            
            {error && <p className="crud-error-message">{error}</p>}
            {mensajeExito && <p className="crud-success-message">{mensajeExito}</p>}

            {cargando && <p className="crud-loading-message">Cargando...</p>}

            {(isCreating || currentResource) ? (
                // Modo Crear o Editar
                <CrudForm
                    fields={fields}
                    initialValues={initialValues}
                    currentResource={currentResource}
                    onSubmit={isCreating ? handleCreate : handleUpdate} // Llama a la función correcta
                    onCancel={handleCancelForm}
                    isCreating={isCreating}
                />
            ) : (
                // Modo Listar
                <div>
                    <button onClick={handleCreateClick} className="crud-add-button">
                        Añadir Nuevo {resourceName.slice(0, -1)}
                    </button>
                    {resources.length === 0 && !cargando ? (
                        <p>No hay {resourceName} creados aún.</p>
                    ) : (
                        <CrudTable
                            resources={resources}
                            columns={columns}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            )}
            
        </div>
    );
}

export default CrudManager;