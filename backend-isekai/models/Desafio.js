const mongoose = require('mongoose');

const DesafioSchema = mongoose.Schema(
    {
        nombre: { // COINCIDE
            type: String,
            required: [true, 'El nombre del desafío es obligatorio.'],
            unique: true,
            trim: true,
        },
        descripcion: { // COINCIDE
            type: String,
            required: [true, 'La descripción del desafío es obligatoria.'],
        },
        // AÑADIDO: 'fechaCreacion' para coincidir con el frontend
        // Nota: 'timestamps: true' ya te da un 'createdAt'. Puedes usarlo o este.
        // Si usas este, considera si necesitas 'createdAt' también.
        fechaCreacion: {
            type: Date,
            default: Date.now,
            required: true // El frontend lo marca como requerido
        },
        // AÑADIDO: 'isActive' para coincidir con el frontend
        isActive: {
            type: Boolean,
            default: false // O true, según tu preferencia inicial
        },

        // Campos existentes en el backend que NO están en el frontend config, pero que puedes mantener:
        tipo: { // Si el frontend no lo gestiona, el backend debería asignarlo o ignorarlo en el CRUD
            type: String,
            required: [true, 'El tipo de criterio del desafío es obligatorio.'],
            enum: ['terapiasCompletadas', 'meditacionMinutos', 'registroAnimo', 'xpGanado'],
        },
        valorRequerido: {
            type: Number,
            required: [true, 'El valor requerido para el desafío es obligatorio.'],
            min: 1,
        },
        recompensaXP: {
            type: Number,
            required: [true, 'La recompensa de XP es obligatoria.'],
            min: 0,
        },
        frecuencia: {
            type: String,
            required: [true, 'La frecuencia del desafío es obligatoria.'],
            enum: ['diario', 'semanal', 'unico'],
        },
    },
    {
        timestamps: true, // Esto te da 'createdAt' y 'updatedAt' automáticamente.
                           // Si 'fechaCreacion' ya lo manejas, 'createdAt' podría ser redundante.
                           // Puedes acceder a 'createdAt' si prefieres no tener 'fechaCreacion' separado
                           // y luego renombrarlo en el controlador si es necesario.
    }
);

module.exports = mongoose.model('Desafio', DesafioSchema);