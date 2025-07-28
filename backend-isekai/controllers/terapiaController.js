const Terapia = require('../models/Terapia'); // Importa el modelo de Terapia
const AppError = require('../utils/appError'); // Si estás usando AppError para manejar errores
const catchAsync = require('../utils/catchAsync'); // Si estás usando catchAsync

/**
 * @desc    Crear un nuevo módulo de terapia
 * @route   POST /api/terapias
 * @access  Private (Admin/Terapeuta - rol verificado por middleware en la ruta)
 */
const crearTerapia = catchAsync(async (req, res, next) => {
    // Los middlewares de autenticación y autorización (protegerRuta, autorizarRol)
    // ya deberían haber verificado que req.usuario existe y tiene el rol correcto.
    // Por lo tanto, NO es necesario repetir la validación de rol aquí.

    const {
        nombre,
        descripcion,
        tipo,
        duracionMinutos,
        costo,
        isActive, // Ahora también viene del frontend, maneja el estado de actividad
        contenidoURL,
        textoCompleto,
        puntosXP,
        nivelRequerido
    } = req.body;

    const creadoPor = req.usuario._id; // Asume que req.usuario está disponible del middleware

    // Validación básica de campos obligatorios
    if (!nombre || !descripcion || !tipo) {
        return next(new AppError('Nombre, descripción y tipo son campos obligatorios.', 400));
    }

    // Opcional: Validaciones de tipo y rango para campos numéricos
    if (duracionMinutos !== undefined && (typeof duracionMinutos !== 'number' || duracionMinutos < 0)) {
        return next(new AppError('La duración en minutos debe ser un número positivo.', 400));
    }
    if (costo !== undefined && (typeof costo !== 'number' || costo < 0)) {
        return next(new AppError('El costo debe ser un número positivo.', 400));
    }
    if (puntosXP !== undefined && (typeof puntosXP !== 'number' || puntosXP < 0)) {
        return next(new AppError('Los puntos de experiencia deben ser un número positivo.', 400));
    }
    if (nivelRequerido !== undefined && (typeof nivelRequerido !== 'number' || nivelRequerido < 0)) {
        return next(new AppError('El nivel requerido debe ser un número positivo.', 400));
    }


    // Verificar si ya existe una terapia con el mismo nombre
    const terapiaExistente = await Terapia.findOne({ nombre });
    if (terapiaExistente) {
        return next(new AppError('Ya existe una terapia con este nombre. Por favor, elige otro.', 400));
    }

    const nuevaTerapia = new Terapia({
        nombre,
        descripcion,
        tipo,
        duracionMinutos,
        costo,
        // Si isActive no se proporciona, usa el valor por defecto del esquema (que es 'true')
        // Si se proporciona, usa el valor enviado.
        isActive: isActive !== undefined ? isActive : true, // O 'false' si tu política inicial es que sea inactiva
        contenidoURL,
        textoCompleto,
        puntosXP,
        nivelRequerido,
        creadoPor
    });

    const terapiaGuardada = await nuevaTerapia.save();

    res.status(201).json({
        status: 'success',
        data: {
            terapia: terapiaGuardada // Clave singular para un solo objeto
        }
    });
});



/**
 * @desc    Obtener todas las terapias (o filtradas por isActive)
 * @route   GET /api/terapias
 * @access  Public (solo terapias activas para usuarios no-admin/terapeuta), Private (Admin/Terapeuta para todas)
 */
const obtenerTerapias = catchAsync(async (req, res, next) => {
    // req.usuario se adjunta por el middleware de autenticación si un token JWT válido está presente.
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    let query = {};
    // Si el usuario NO es administrador ni terapeuta, solo mostrar terapias activas.
    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        query.isActive = true;
    }

    const terapias = await Terapia.find(query).populate('creadoPor', 'nombreUsuario correoElectronico rol');

    res.status(200).json({
        status: 'success',
        results: terapias.length, // Añade el número de resultados para consistencia
        data: {
            terapias // Clave PLURAL 'terapias' para la lista
        }
    });
});



/**
 * @desc    Obtener una terapia por ID
 * @route   GET /api/terapias/:id
 * @access  Public (si está activa), Private (Admin/Terapeuta para cualquier estado)
 */
const obtenerTerapiaPorId = catchAsync(async (req, res, next) => {
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    const terapia = await Terapia.findById(req.params.id).populate('creadoPor', 'nombreUsuario correoElectronico rol');

    if (!terapia) {
        return next(new AppError('Terapia no encontrada.', 404));
    }

    // Si la terapia no está activa Y el usuario NO es admin/terapeuta, denegar acceso.
    if (!terapia.isActive && rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        return next(new AppError('Acceso denegado. Esta terapia no está activa o no tienes permisos para verla.', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            terapia // Clave singular para un solo objeto
        }
    });
});



/**
 * @desc    Actualizar un módulo de terapia
 * @route   PUT /api/terapias/:id (o PATCH si solo se permiten actualizaciones parciales)
 * @access  Private (Admin/Terapeuta - rol verificado por middleware en la ruta)
 */
const actualizarTerapia = catchAsync(async (req, res, next) => {
    // NO es necesario repetir la validación de rol aquí, ya la maneja el middleware de ruta.

    const {
        nombre,
        descripcion,
        tipo,
        duracionMinutos,
        costo,
        isActive,
        contenidoURL,
        textoCompleto,
        puntosXP,
        nivelRequerido
    } = req.body;

    let terapia = await Terapia.findById(req.params.id);

    if (!terapia) {
        return next(new AppError('Terapia no encontrada.', 404));
    }

    // Opcional: Validaciones de tipo y rango para campos numéricos en la actualización
    if (duracionMinutos !== undefined && (typeof duracionMinutos !== 'number' || duracionMinutos < 0)) {
        return next(new AppError('La duración en minutos debe ser un número positivo.', 400));
    }
    if (costo !== undefined && (typeof costo !== 'number' || costo < 0)) {
        return next(new AppError('El costo debe ser un número positivo.', 400));
    }
    if (puntosXP !== undefined && (typeof puntosXP !== 'number' || puntosXP < 0)) {
        return next(new AppError('Los puntos de experiencia deben ser un número positivo.', 400));
    }
    if (nivelRequerido !== undefined && (typeof nivelRequerido !== 'number' || nivelRequerido < 0)) {
        return next(new AppError('El nivel requerido debe ser un número positivo.', 400));
    }

    // Verificar si el nuevo nombre ya existe y no pertenece a la misma terapia
    if (nombre && nombre !== terapia.nombre) {
        const terapiaExistente = await Terapia.findOne({ nombre });
        if (terapiaExistente && String(terapiaExistente._id) !== String(terapia._id)) {
            return next(new AppError('Ya existe otra terapia con este nombre.', 400));
        }
    }

    // Actualizar campos solo si se proporcionan en el cuerpo de la solicitud
    terapia.nombre = nombre !== undefined ? nombre : terapia.nombre;
    terapia.descripcion = descripcion !== undefined ? descripcion : terapia.descripcion;
    terapia.tipo = tipo !== undefined ? tipo : terapia.tipo;
    terapia.duracionMinutos = duracionMinutos !== undefined ? duracionMinutos : terapia.duracionMinutos;
    terapia.costo = costo !== undefined ? costo : terapia.costo;
    terapia.isActive = isActive !== undefined ? isActive : terapia.isActive;
    terapia.contenidoURL = contenidoURL !== undefined ? contenidoURL : terapia.contenidoURL;
    terapia.textoCompleto = textoCompleto !== undefined ? textoCompleto : terapia.textoCompleto;
    terapia.puntosXP = puntosXP !== undefined ? puntosXP : terapia.puntosXP;
    terapia.nivelRequerido = nivelRequerido !== undefined ? nivelRequerido : terapia.nivelRequerido;

    const terapiaActualizada = await terapia.save(); // Guarda los cambios, actualizando `updatedAt`

    res.status(200).json({
        status: 'success',
        data: {
            terapia: terapiaActualizada // Clave singular para un solo objeto
        }
    });
});


/**
 * @desc    Eliminar un módulo de terapia
 * @route   DELETE /api/terapias/:id
 * @access  Private (Admin/Terapeuta - rol verificado por middleware en la ruta)
 */
const eliminarTerapia = catchAsync(async (req, res, next) => {
    // NO es necesario repetir la validación de rol aquí, ya la maneja el middleware de ruta.

    const terapia = await Terapia.findById(req.params.id);

    if (!terapia) {
        return next(new AppError('Terapia no encontrada para eliminar.', 404));
    }

    await Terapia.deleteOne({ _id: req.params.id }); // O `await Terapia.findByIdAndDelete(req.params.id);`

    res.status(200).json({ status: 'success', message: 'Terapia eliminada exitosamente.' });
});

module.exports = {
    crearTerapia,
    obtenerTerapias,
    obtenerTerapiaPorId,
    actualizarTerapia,
    eliminarTerapia
};