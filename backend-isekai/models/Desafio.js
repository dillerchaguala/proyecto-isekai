const mongoose = require('mongoose');

const DesafioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del desafío es obligatorio.'],
            unique: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, 'La descripción del desafío es obligatoria.'],
        },
        // 'fechaCreacion' se elimina y se usa 'createdAt' de timestamps para simplificar.
        // Si realmente necesitas 'fechaCreacion' separado, hazlo required: false y maneja su defecto en el controlador.

        isActive: {
            type: Boolean,
            default: false // O true, según tu preferencia inicial para los nuevos desafíos
        },

        // --- CAMPOS AJUSTADOS PARA COMPATIBILIDAD CON EL CRUD DEL FRONTEND ---
        // Ahora son 'required: false' porque el frontend CrudManager no los gestiona.
        // Si necesitas que sean requeridos, DEBES añadirlos al 'desafioConfig' del frontend.
        tipo: {
            type: String,
            required: false, // CAMBIO: ahora opcional para el CRUD
            enum: ['terapiasCompletadas', 'meditacionMinutos', 'registroAnimo', 'xpGanado', 'ninguno'], // Añade 'ninguno' como default o si es opcional
            default: 'ninguno' // Añade un valor por defecto si no se proporciona
        },
        valorRequerido: {
            type: Number,
            required: false, // CAMBIO: ahora opcional
            min: 0,
            default: 0 // Añade un valor por defecto
        },
        recompensaXP: {
            type: Number,
            required: false, // CAMBIO: ahora opcional
            min: 0,
            default: 0 // Añade un valor por defecto
        },
        frecuencia: {
            type: String,
            required: false, // CAMBIO: ahora opcional
            enum: ['diario', 'semanal', 'unico', 'no aplica'], // Añade 'no aplica' o similar
            default: 'no aplica' // Añade un valor por defecto
        },
    },
    {
        timestamps: true, // Esto te da 'createdAt' y 'updatedAt' automáticamente.
    }
);

module.exports = mongoose.model('Desafio', DesafioSchema);