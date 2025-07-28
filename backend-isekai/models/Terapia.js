const mongoose = require('mongoose');

const EsquemaTerapia = new mongoose.Schema({
    // Cambiado 'titulo' a 'nombre' para coincidir con el frontend
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
        trim: true
    },
    // Añadido 'duracionMinutos' para coincidir con el frontend
    duracionMinutos: {
        type: Number,
        required: true
    },
    // Añadido 'costo' para coincidir con el frontend
    costo: {
        type: Number,
        required: true
    },
    // Cambiado 'estado' a 'isActive' y tipo a Boolean para coincidir con el frontend
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
        required: false, // Hago opcional si no lo manejas desde el frontend directamente
        default: 100
    },
    nivelRequerido: {
        type: Number,
        required: false, // Hago opcional si no lo manejas desde el frontend directamente
        default: 1
    },
    creadoPor: { // Si es un campo interno, asegúrate de que se asigne en el controlador
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false // Hago opcional si no lo manejas desde el frontend directamente
    },
    // timestamps de Mongoose suelen manejar esto automáticamente, pero los tienes definidos
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    ultimaActualizacion: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Mongoose puede manejar automáticamente createdAt y updatedAt si quitas los tuyos manuales y dejas solo esto.

// Middleware para actualizar la fecha de última actualización
EsquemaTerapia.pre('save', function(next) {
    this.ultimaActualizacion = Date.now();
    next();
});

module.exports = mongoose.model('Terapia', EsquemaTerapia);