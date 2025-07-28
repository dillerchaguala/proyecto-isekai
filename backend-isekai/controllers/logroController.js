const Logro = require('../models/Logro');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Crear un nuevo logro
 * @route   POST /api/logros
 * @access  Private (Admin/Terapeuta - rol verificado por middleware)
 */
exports.crearLogro = catchAsync(async (req, res, next) => {
    // Desestructuramos todos los campos que podrían venir del cuerpo de la solicitud,
    // incluyendo los campos anidados de 'criterio'.
    const { nombre, descripcion, isActive, criterio, icono, recompensa } = req.body;

    // Validación básica de los campos obligatorios para el CRUD.
    if (!nombre || !descripcion) {
        return next(new AppError('Por favor, proporciona el nombre y la descripción para el logro.', 400));
    }

    // Validación del valor del criterio si se proporciona y es de tipo número.
    // Esto es importante si el frontend envía el criterio.
    if (criterio && criterio.valor !== undefined) {
        if (typeof criterio.valor !== 'number' || isNaN(criterio.valor) || criterio.valor < 0) {
            return next(new AppError('El valor del criterio debe ser un número positivo.', 400));
        }
    }

    // Verificar si ya existe un logro con el mismo nombre (asumiendo que 'nombre' es único).
    const logroExistente = await Logro.findOne({ nombre });
    if (logroExistente) {
        return next(new AppError('Ya existe un logro con este nombre. Por favor, elige otro.', 400));
    }

    // Crear el nuevo logro. Los campos que no vengan en req.body usarán sus valores por defecto del esquema.
    const nuevoLogro = await Logro.create({
        nombre,
        descripcion,
        isActive: isActive !== undefined ? isActive : true, // Asigna isActive o true por defecto
        criterio: criterio || { tipo: 'ninguno', valor: 0 }, // Usa el criterio enviado o un objeto por defecto
        icono: icono || '', // Usa el icono enviado o cadena vacía por defecto
        recompensa: recompensa || 'insignia', // Usa la recompensa enviada o 'insignia' por defecto
    });

    res.status(201).json({
        status: 'success',
        data: {
            logro: nuevoLogro
        }
    });
});



/**
 * @desc    Obtener todos los logros
 * @route   GET /api/logros
 * @access  Public (solo activos), Private (Admin/Terapeuta para todos)
 */
exports.obtenerTodosLosLogros = catchAsync(async (req, res, next) => {
    let query = {};
    // req.usuario se adjunta por el middleware de autenticación si un token JWT válido está presente.
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    // Si el usuario NO es administrador ni terapeuta, solo mostrar logros activos.
    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        query.isActive = true;
    }

    const logros = await Logro.find(query); // Aplicar el filtro si existe
    res.status(200).json({
        status: 'success',
        results: logros.length, // Añadir el número de resultados
        data: {
            logros // Clave PLURAL 'logros' para la lista
        }
    });
});



/**
 * @desc    Obtener un logro por ID
 * @route   GET /api/logros/:id
 * @access  Public (si está activo), Private (Admin/Terapeuta para cualquier estado)
 */
exports.obtenerLogroPorId = catchAsync(async (req, res, next) => {
    const logro = await Logro.findById(req.params.id);

    if (!logro) {
        return next(new AppError('No se encontró ningún logro con ese ID.', 404));
    }

    const rolUsuario = req.usuario ? req.usuario.rol : null;
    // Si el logro no está activo Y el usuario NO es admin/terapeuta, denegar acceso.
    if (!logro.isActive && rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        return next(new AppError('Acceso denegado: El logro no está activo o no tienes permisos para verlo.', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            logro // Clave singular 'logro'
        }
    });
});



/**
 * @desc    Actualizar un logro
 * @route   PATCH /api/logros/:id
 * @access  Private (Admin/Terapeuta - rol verificado por middleware)
 */
exports.actualizarLogro = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Desestructuramos todos los campos que pueden venir para actualizar.
    const { nombre, descripcion, isActive, criterio, icono, recompensa } = req.body;

    let logro = await Logro.findById(id);
    if (!logro) {
        return next(new AppError('Logro no encontrado.', 404));
    }

    // Verificar duplicidad de nombre si se está cambiando.
    if (nombre && nombre !== logro.nombre) {
        const logroExistente = await Logro.findOne({ nombre });
        if (logroExistente && logroExistente._id.toString() !== id) {
            return next(new AppError('Ya existe otro logro con este nombre.', 400));
        }
    }

    // Validar el criterio.valor si se proporciona.
    if (criterio && criterio.valor !== undefined) {
        if (typeof criterio.valor !== 'number' || isNaN(criterio.valor) || criterio.valor < 0) {
            return next(new AppError('El valor del criterio debe ser un número positivo.', 400));
        }
    }

    // Construir el objeto de campos a actualizar.
    const updateFields = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (descripcion !== undefined) updateFields.descripcion = descripcion;
    if (isActive !== undefined) updateFields.isActive = isActive;

    // Actualizar campos anidados de 'criterio' si se proporcionan.
    if (criterio !== undefined) {
        updateFields.criterio = {}; // Inicializa el objeto si se va a modificar
        if (criterio.tipo !== undefined) updateFields['criterio.tipo'] = criterio.tipo;
        if (criterio.valor !== undefined) updateFields['criterio.valor'] = criterio.valor;
    }
    // Si `criterio` no viene definido en el body pero sí `criterio.tipo` o `criterio.valor`, entonces
    // la asignación `updateFields.criterio = {};` previa no funcionaría.
    // Una forma más robusta es actualizar campo por campo en el objeto existente:
    if (criterio && criterio.tipo !== undefined) logro.criterio.tipo = criterio.tipo;
    if (criterio && criterio.valor !== undefined) logro.criterio.valor = criterio.valor;


    if (icono !== undefined) updateFields.icono = icono;
    if (recompensa !== undefined) updateFields.recompensa = recompensa;

    // Usar findByIdAndUpdate para una actualización más eficiente.
    // El `logro.save()` también funciona, pero `findByIdAndUpdate` es mejor si solo actualizas ciertos campos.
    const logroActualizado = await Logro.findByIdAndUpdate(
        id,
        updateFields, // Pasa el objeto con los campos a actualizar
        {
            new: true,         // Devuelve el documento modificado en lugar del original
            runValidators: true // Ejecuta validadores de esquema en la actualización
        }
    );
    // Si usas el enfoque de `logro.campo = nuevoValor; await logro.save();` (comentado arriba),
    // no necesitas `updateFields` ni `findByIdAndUpdate` aquí, solo `await logro.save();`

    res.status(200).json({
        status: 'success',
        data: {
            logro: logroActualizado
        }
    });
});



/**
 * @desc    Eliminar un logro
 * @route   DELETE /api/logros/:id
 * @access  Private (Solo Admin - rol verificado por middleware)
 */
exports.eliminarLogro = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Usar findByIdAndDelete para eliminar y obtener el documento eliminado.
    const logro = await Logro.findByIdAndDelete(id);

    if (!logro) {
        return next(new AppError('No se encontró ningún logro con ese ID para eliminar.', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Logro eliminado exitosamente.'
    });
});