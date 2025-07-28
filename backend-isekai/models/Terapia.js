const mongoose = require('mongoose');

const EsquemaTerapia = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true,
        // --- SUGERENCIA: Añadir enum si los tipos son predefinidos ---
        // Si los tipos de terapia son específicos (ej. 'Individual', 'Grupal', 'Online'),
        // es MUY RECOMENDABLE usar un enum para validar los valores.
        // Ejemplo: enum: ['Individual', 'Grupal', 'Online', 'Presencial'],
        // Si no tienes un enum claro, déjalo como String simple.
    },
    duracionMinutos: {
        type: Number,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    isActive: { // Representa si la terapia está activa o inactiva
        type: Boolean,
        default: false // O true, según tu preferencia inicial
    },

    // Campos existentes que NO están en el frontend config, pero puedes mantener si los necesitas internamente
    contenidoURL: {
        type: String,
        required: false
    },
    textoCompleto: {
        type: String,
        required: false
    },
    puntosXP: {
        type: Number,
        required: false,
        default: 100
    },
    nivelRequerido: {
        type: Number,
        required: false,
        default: 1
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
    // --- ELIMINADOS: fechaCreacion y ultimaActualizacion ---
    // Mongoose los manejará automáticamente con timestamps: true
}, {
    timestamps: true // Esto añadirá 'createdAt' y 'updatedAt' automáticamente.
                     // Y se actualizará 'updatedAt' en cada save/update.
});

// --- ELIMINADO: Middleware para actualizar la fecha de última actualización ---
// Mongoose ya lo hace con timestamps: true

module.exports = mongoose.model('Terapia', EsquemaTerapia);