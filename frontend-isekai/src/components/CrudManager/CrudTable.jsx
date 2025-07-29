// frontend-isekai/src/components/CrudManager/CrudTable.jsx
import React from 'react';
import './CrudTable.css'; // Crearás este archivo CSS en el siguiente paso

function CrudTable({ resources, columns, onEdit, onDelete }) {
    if (!Array.isArray(resources)) {
        return <p>Error: los datos no son válidos para mostrar.</p>;
    }
    if (!Array.isArray(columns)) {
        return <p>Error: las columnas no están definidas correctamente.</p>;
    }
    if (resources.length === 0) {
        return <p>No hay recursos para mostrar.</p>; // Mensaje si la lista está vacía
    }

    return (
        <div className="crud-table-container">
            <table className="crud-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                        <th>Acciones</th> {/* Columna para los botones de Editar/Eliminar */}
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <tr key={resource._id}> {/* Asumimos que todos los recursos tienen un _id */}
                            {columns.map((col, colIndex) => (
                                <td key={`${resource._id}-${colIndex}`}>
                                    {/* Si el accessor es una función, la ejecuta para obtener el valor */}
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(resource)
                                        : resource[col.accessor]}
                                </td>
                            ))}
                            <td className="crud-table-actions">
                                <button
                                    onClick={() => onEdit(resource)}
                                    className="crud-edit-button"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(resource._id)}
                                    className="crud-delete-button"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CrudTable;