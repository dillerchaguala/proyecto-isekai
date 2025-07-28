// backend-isekai/controllers/estadoAnimoController.js
const EstadoAnimo = require('../models/EstadoAnimo');
const Usuario = require('../models/User'); // Necesitamos el modelo de Usuario
const { otorgaDesafios } = require('./desafioController'); // Importamos nuestra función de desafíos

// Importamos las utilidades para un manejo de errores consistente
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Registrar un nuevo estado de ánimo
 * @route   POST /api/estado-animo
 * @access  Private (Solo usuarios autenticados - rol verificado por middleware)
 */
const registrarEstadoAnimo = catchAsync(async (req, res, next) => {
    const { estado, notas } = req.body;
    // req.usuario._id es adjuntado por tu middleware de autenticación (protegerRuta)
    const usuarioId = req.usuario._id; 
    
    if (!estado) {
        return next(new AppError('El estado de ánimo es requerido.', 400));
    }

    const nuevoRegistro = await EstadoAnimo.create({
        usuario: usuarioId,
        estado,
        notas,
    });

    // Cargar el usuario para actualizar sus contadores de desafíos
    // Es necesario cargar el usuario completo porque 'otorgaDesafios' opera sobre el objeto usuario y lo guarda.
    const usuario = await Usuario.findById(usuarioId);
    if (usuario) {
        // Llama a otorgaDesafios con el tipo 'registrosAnimo' (¡plural!) y la cantidad (1 por cada registro)
        // Asegúrate que tu lógica de desafíos en desafioController.js esté preparada para este tipo.
        await otorgaDesafios(usuario, 'registrosAnimo', 1); 
    }

    // Respuesta consistente con el formato { status: 'success', data: { registro: ... } }
    res.status(201).json({ 
        status: 'success', 
        message: 'Estado de ánimo registrado exitosamente', 
        data: {
            registro: nuevoRegistro 
        }
    });
});

/**
 * @desc    Obtener historial de estados de ánimo del usuario
 * @route   GET /api/estado-animo
 * @access  Private (Solo usuarios autenticados - rol verificado por middleware)
 */
const obtenerHistorialEstadoAnimo = catchAsync(async (req, res, next) => {
    // req.usuario._id es adjuntado por tu middleware de autenticación (protegerRuta)
    const historial = await EstadoAnimo.find({ usuario: req.usuario._id }) 
                                      .sort({ fecha: -1 }); // Ordenar del más reciente al más antiguo

    // Respuesta consistente con el formato { status: 'success', data: { historial: [...] } }
    res.status(200).json({
        status: 'success',
        results: historial.length, // Opcional: número de resultados
        data: {
            historial: historial
        }
    });
});

module.exports = {
    registrarEstadoAnimo,
    obtenerHistorialEstadoAnimo,
};