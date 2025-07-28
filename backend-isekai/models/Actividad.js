const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la actividad es obligatorio.'],
        unique: true, // Para asegurar que cada actividad tenga un nombre único
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la actividad es obligatoria.']
    },
    urlRecurso: { // Campo para almacenar una URL a un video, audio, artículo, etc.
        type: String,
        required: false // No es obligatorio, ya que algunas actividades pueden no tener un recurso externo
    },
    isActive: { // Indica si la actividad está activa y disponible para los usuarios
        type: Boolean,
        default: true // Por defecto, una actividad recién creada está activa
    },
    // Puedes añadir otros campos que consideres útiles para Actividades, por ejemplo:
    // duracionEstimada: { type: Number, min: 0 }, // Duración estimada en minutos
    // tipoActividad: { type: String, enum: ['meditacion', 'ejercicio', 'lectura', 'video'], default: 'ejercicio' },
    // creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // Si quieres registrar quién la creó
}, {
    timestamps: true // Esto añadirá automáticamente 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Actividad', ActividadSchema);