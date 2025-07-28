const mongoose = require('mongoose');

const logroSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'Por favor, añade un nombre para el logro'],
            unique: true,
        },
        descripcion: {
            type: String,
            required: [true, 'Por favor, añade una descripción para el logro'],
        },
        // AÑADIDO: isActive para coincidir con el frontend
        isActive: {
            type: Boolean,
            default: true, // Por defecto, un logro recién creado está activo
        },
        // Criterio para desbloquear el logro
        criterio: {
            tipo: {
                type: String,
                // HAGO ESTOS CAMPOS NO REQUERIDOS SI NO SE VAN A ENVIAR DESDE EL CRUD DEL FRONTEND.
                // Si quieres que sean siempre requeridos, debes añadir lógica para asignarlos en el controlador
                // o añadirlos al 'logroConfig.fields' en el frontend.
                required: false, // Puedes cambiar a true si SIEMPRE se gestionan de alguna forma
                enum: ['terapiasCompletadas', 'nivelAlcanzado', 'xpAcumulado', 'ninguno'], // Añade 'ninguno' o similar si puedes crearlos sin un criterio específico al inicio
                default: 'ninguno' // Valor por defecto si no se especifica
            },
            valor: {
                type: Number,
                required: false, // Idem.
                default: 0
            },
        },
        icono: {
            type: String,
            default: '',
        },
        recompensa: {
            type: String,
            default: 'insignia',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Logro', logroSchema);