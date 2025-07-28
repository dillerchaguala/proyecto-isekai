// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas de forma segura

// Define el esquema (estructura) de un usuario
const EsquemaUsuario = new mongoose.Schema({
    // Nombre de usuario: obligatorio, único y sin espacios al inicio/final
    nombreUsuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Correo electrónico: obligatorio, único, en minúsculas y con formato válido
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un correo electrónico válido']
    },
    // Contraseña: obligatoria y con un mínimo de 6 caracteres
    contrasena: {
        type: String,
        required: true,
        minlength: 6
    },
    // Rol del usuario: define si es paciente, terapeuta o administrador
    rol: {
        type: String,
        enum: ['paciente', 'terapeuta', 'administrador'], // Valores permitidos para el rol
        default: 'paciente' // Rol por defecto si no se especifica
    },

    // Puntos de experiencia ganados en la gamificación
    puntosExperiencia: {
        type: Number,
        default: 0
    },

    // Nivel actual en la gamificación
    nivelActual: {
        type: Number,
        default: 1
    },

    // --- NUEVO CAMPO: Historial de Terapias Completadas ---
    terapiasCompletadas: [
        {
            terapia: { // Referencia al ID de la Terapia completada
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Terapia', // Hace referencia al modelo 'Terapia'
                required: true,
            },
            fechaCompletado: { // Fecha en que se completó la terapia
                type: Date,
                default: Date.now,
            },
            xpGanado: { // XP ganado por esta instancia de la terapia
                type: Number,
                required: true,
            },
        },
    ],

    // Fecha y hora del último inicio de sesión del usuario
    ultimoInicioSesion: {
        type: Date
    },


    logrosConseguidos: [
        {
            logro: { // Referencia al ID del Logro
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Logro', // Hace referencia al modelo 'Logro'
                required: true,
            },
            fechaConseguido: { // Fecha en que se consiguió el logro
                type: Date,
                default: Date.now,
            },
        },
    ],
    desafiosCompletados: [
        {
            desafio: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Desafio',
            },
            fechaCompletado: {
                type: Date,
                default: Date.now,
            },
            
        },
    ],
    
},
{
    timestamps: true // Esto añade `createdAt` y `updatedAt` automáticamente
});

// --- Middleware (función que se ejecuta antes) de Mongoose para Encriptar Contraseñas ---
EsquemaUsuario.pre('save', async function(siguiente) {
    // Solo encripta la contraseña si ha sido modificada (o es nueva)
    if (!this.isModified('contrasena')) {
        return siguiente();
    }
    try {
        const sal = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena, sal);
        siguiente(); // Continúa con el proceso de guardado
    } catch (error) {
        siguiente(error); // Pasa el error para que Mongoose lo maneje
    }
});

// --- Método Personalizado para Comparar Contraseñas ---
// Usas `compararContrasena` en lugar de `matchPassword`, lo mantengo.
EsquemaUsuario.methods.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

// Exporta el modelo, usando 'Usuario' como nombre del modelo
module.exports = mongoose.model('Usuario', EsquemaUsuario);