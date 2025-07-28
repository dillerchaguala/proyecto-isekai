// models/EstadoAnimo.js
const mongoose = require('mongoose');

const EstadoAnimoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    estado: { // Ej. 'Excelente', 'Bien', 'Neutral', 'Mal', 'Muy Mal'
        type: String,
        required: true,
        enum: ['Excelente','Muy Bien', 'Bien', 'Normal', 'Regular','Mal', 'Muy Mal'], 
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    notas: {
        type: String,
        maxlength: 200,
        trim: true,
    },
}, {
    timestamps: true, // Esto añade `createdAt` y `updatedAt` automáticamente
});

module.exports = mongoose.model('EstadoAnimo', EstadoAnimoSchema);