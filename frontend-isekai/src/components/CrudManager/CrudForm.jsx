// frontend-isekai/src/components/CrudManager/CrudForm.jsx
import React, { useState, useEffect } from 'react';
import './CrudForm.css'; // Crearás este archivo CSS en el siguiente paso

function CrudForm({ fields, initialValues, currentResource, onSubmit, onCancel, isCreating }) {
    // El estado del formulario se inicializa con los valores del recurso actual (para edición)
    // o con los valores iniciales (para creación)
    const [formData, setFormData] = useState(initialValues);

    // Si estamos en modo edición (hay un currentResource), cargamos esos datos en el formulario
    useEffect(() => {
        if (currentResource) {
            // Cuando editas un recurso, los campos pueden estar anidados (ej. criterio.tipo)
            // Necesitamos 'aplanar' esos valores para que coincidan con los nombres de los campos definidos en `fields`
            const loadedData = {};
            fields.forEach(field => {
                if (field.name.includes('.')) { // Si es un campo anidado como 'criterio.tipo'
                    const [parent, child] = field.name.split('.');
                    loadedData[field.name] = currentResource[parent]?.[child] || '';
                } else {
                    loadedData[field.name] = currentResource[field.name] || '';
                }
            });
            setFormData(loadedData);
        } else {
            // Si es un nuevo recurso, reiniciamos a los valores iniciales
            setFormData(initialValues);
        }
    }, [currentResource, initialValues, fields]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Manejar tipos de input específicos si es necesario (ej. checkboxes)
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Cuando envías el formulario, necesitamos 're-anidar' los campos
        // para que coincidan con la estructura del modelo del backend (ej. { criterio: { tipo: '...', valor: '...' } })
        const formattedData = {};
        Object.keys(formData).forEach(key => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!formattedData[parent]) {
                    formattedData[parent] = {};
                }
                formattedData[parent][child] = formData[key];
            } else {
                formattedData[key] = formData[key];
            }
        });

        // Convertir valores numéricos si es necesario
        fields.forEach(field => {
            if (field.type === 'number' && formattedData[field.name] !== undefined) {
                // Si el campo es anidado y numérico
                if (field.name.includes('.')) {
                    const [parent, child] = field.name.split('.');
                    if (formattedData[parent] && formattedData[parent][child] !== undefined) {
                        formattedData[parent][child] = Number(formattedData[parent][child]);
                    }
                } else {
                    formattedData[field.name] = Number(formattedData[field.name]);
                }
            }
        });

        onSubmit(formattedData); // Llama a la función onSubmit del CrudManager
    };

    return (
        <form onSubmit={handleSubmit} className="crud-form">
            {fields.map((field) => (
                <div className="form-group" key={field.name}>
                    <label htmlFor={field.name}>{field.label}:</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''} // Asegura que no sea undefined
                            onChange={handleChange}
                            required={field.required}
                            rows={field.rows || 4}
                            placeholder={field.placeholder}
                        ></textarea>
                    ) : field.type === 'select' ? (
                        <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                        >
                            {field.options && field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            placeholder={field.placeholder}
                        />
                    )}
                </div>
            ))}
            <button type="submit" className="crud-submit-button">
                {isCreating ? 'Crear' : 'Actualizar'}
            </button>
            <button type="button" onClick={onCancel} className="crud-cancel-button">
                Cancelar
            </button>
        </form>
    );
}

export default CrudForm;