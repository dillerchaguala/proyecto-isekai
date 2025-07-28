// frontend-isekai/src/pages/CrearLogro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearLogro.css'; // Asegúrate de que este archivo CSS exista o créalo

function CrearLogro() {
    // --- ESTADOS ACTUALIZADOS PARA COINCIDIR CON TU MODELO ---
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [criterioTipo, setCriterioTipo] = useState('terapiasCompletadas'); // Valor por defecto del enum
    const [criterioValor, setCriterioValor] = useState('');
    const [icono, setIcono] = useState(''); // Opcional, según tu modelo
    const [recompensa, setRecompensa] = useState('insignia'); // Valor por defecto del modelo

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);
    const navegar = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);
        setExito(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No autorizado: Token no encontrado.');
                setCargando(false);
                return;
            }

            // Construir el objeto de datos para enviar al backend
            const logroData = {
                nombre,
                descripcion,
                criterio: {
                    tipo: criterioTipo,
                    valor: parseInt(criterioValor) // Asegurarse de que el valor es un número
                },
                icono, // Se enviará vacío si no se llena
                recompensa // Se enviará 'insignia' si no se cambia
            };

            const response = await fetch('http://localhost:5000/api/logros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluir el token para autenticación
                },
                body: JSON.stringify(logroData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el logro.');
            }

            const data = await response.json();
            console.log('Logro creado exitosamente:', data);
            setExito(true);
            // Limpiar los campos del formulario
            setNombre('');
            setDescripcion('');
            setCriterioTipo('terapiasCompletadas');
            setCriterioValor('');
            setIcono('');
            setRecompensa('insignia');

            // Opcional: Redirigir al dashboard o a una lista de logros después de un éxito
            // setTimeout(() => navegar('/dashboard'), 2000);

        } catch (err) {
            console.error('Error al crear logro:', err);
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="crear-logro-container">
            <h2>Crear Nuevo Logro</h2>
            <form onSubmit={handleSubmit} className="logro-form">
                {error && <p className="error-message">{error}</p>}
                {exito && <p className="success-message">¡Logro creado exitosamente!</p>}

                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Logro:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows="4"
                        required
                    ></textarea>
                </div>

                {/* --- CAMPOS PARA EL CRITERIO --- */}
                <div className="form-group">
                    <label htmlFor="criterioTipo">Criterio - Tipo:</label>
                    <select
                        id="criterioTipo"
                        value={criterioTipo}
                        onChange={(e) => setCriterioTipo(e.target.value)}
                        required
                    >
                        <option value="terapiasCompletadas">Terapias Completadas</option>
                        <option value="nivelAlcanzado">Nivel Alcanzado</option>
                        <option value="xpAcumulado">XP Acumulado</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="criterioValor">Criterio - Valor:</label>
                    <input
                        type="number"
                        id="criterioValor"
                        value={criterioValor}
                        onChange={(e) => setCriterioValor(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                {/* --- CAMPOS OPCIONALES --- */}
                <div className="form-group">
                    <label htmlFor="icono">URL del Ícono (opcional):</label>
                    <input
                        type="text"
                        id="icono"
                        value={icono}
                        onChange={(e) => setIcono(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="recompensa">Recompensa (opcional):</label>
                    <input
                        type="text"
                        id="recompensa"
                        value={recompensa}
                        onChange={(e) => setRecompensa(e.target.value)}
                        placeholder="Por ejemplo: insignia, título, etc."
                    />
                </div>

                <button type="submit" disabled={cargando} className="submit-button">
                    {cargando ? 'Creando...' : 'Crear Logro'}
                </button>
                <button type="button" onClick={() => navegar('/dashboard')} className="back-button">
                    Volver al Dashboard
                </button>
            </form>
        </div>
    );
}

export default CrearLogro;