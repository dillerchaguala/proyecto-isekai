// controllers/estadoAnimoController.js
const EstadoAnimo = require('../models/EstadoAnimo');
const Usuario = require('../models/User'); // Necesitamos el modelo de Usuario
const { otorgaDesafios } = require('./desafioController'); // Importamos nuestra función de desafíos

// @desc    Registrar un nuevo estado de ánimo
// @route   POST /api/estado-animo
// @access  Private (Solo usuarios autenticados)
const registrarEstadoAnimo = async (req, res) => {
    const { estado, notas } = req.body;
    // --- CORRECCIÓN AQUÍ: Usamos req.usuario._id porque así lo adjunta tu middleware ---
    const usuarioId = req.usuario._id; 
    
    if (!estado) {
        return res.status(400).json({ message: 'El estado de ánimo es requerido.' });
    }

    try {
        const nuevoRegistro = await EstadoAnimo.create({
            usuario: usuarioId,
            estado,
            notas,
        });

        // Opcional: Cargar el usuario para actualizar sus contadores de desafíos
        const usuario = await Usuario.findById(usuarioId);
        if (usuario) {
            // Llama a otorgaDesafios con el tipo 'registrosAnimo' (¡plural!)
            await otorgaDesafios(usuario, 'registrosAnimo', 1); // Pasamos 1 porque es 1 registro de ánimo
        }

        res.status(201).json({ message: 'Estado de ánimo registrado exitosamente', registro: nuevoRegistro });

    } catch (error) {
        console.error("Error al registrar estado de ánimo:", error.message);
        res.status(500).json({ message: 'Error del servidor al registrar el estado de ánimo.' });
    }
};

// @desc    Obtener historial de estados de ánimo del usuario
// @route   GET /api/estado-animo
// @access  Private (Solo usuarios autenticados)
const obtenerHistorialEstadoAnimo = async (req, res) => {
    try {
        // --- CORRECCIÓN AQUÍ: Usamos req.usuario._id ---
        const historial = await EstadoAnimo.find({ usuario: req.usuario._id }) 
                                          .sort({ fecha: -1 }); // Ordenar del más reciente al más antiguo
        res.status(200).json(historial);
    } catch (error) {
        console.error("Error al obtener historial de estado de ánimo:", error.message);
        res.status(500).json({ message: 'Error del servidor al obtener el historial.' });
    }
};

module.exports = {
    registrarEstadoAnimo,
    obtenerHistorialEstadoAnimo,
};