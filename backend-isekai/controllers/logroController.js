// backend-isekai/controllers/logroController.js
const Logro = require('../models/Logro');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Crear un nuevo logro
// @route   POST /api/logros
// @access  Private (Admin/Terapeuta)
exports.crearLogro = catchAsync(async (req, res, next) => {
    // Los middlewares authController.protect y authController.restrictTo ya deberían haber verificado el usuario y el rol.

    const { nombre, descripcion, isActive } = req.body; // Campos del frontend CRUD

    // Asegúrate de que los campos internos del modelo que no vienen del frontend tengan valores por defecto
    // o se manejen apropiadamente. Asumo que criterio.tipo y criterio.valor son opcionales en el modelo ahora.
    const criterioTipo = req.body.criterio?.tipo || 'ninguno'; // Valor por defecto si no viene
    const criterioValor = req.body.criterio?.valor || 0; // Valor por defecto si no viene
    const icono = req.body.icono || '';
    const recompensa = req.body.recompensa || 'insignia';


    // Validación básica de los campos que SÍ vienen del frontend CRUD
    if (!nombre || !descripcion) {
        return next(new AppError('Por favor, proporciona el nombre y la descripción para el logro.', 400));
    }

    // Nota: La validación de criterio.valor aquí es importante si lo estás enviando,
    // pero si no viene del frontend CrudManager, esta validación podría fallar.
    // Si no se envía desde el CrudManager, lo manejará el valor por defecto que pusimos arriba.
    if (req.body.criterio && req.body.criterio.valor !== undefined) {
        if (typeof req.body.criterio.valor !== 'number' || isNaN(req.body.criterio.valor) || req.body.criterio.valor < 0) {
            return next(new AppError('El valor del criterio debe ser un número positivo.', 400));
        }
    }


    const logroExistente = await Logro.findOne({ nombre });
    if (logroExistente) {
        return next(new AppError('Ya existe un logro con este nombre. Por favor, elige otro.', 400));
    }

    const nuevoLogro = await Logro.create({
        nombre,
        descripcion,
        isActive: isActive !== undefined ? isActive : true, // Asigna isActive
        criterio: { // Asigna el objeto anidado con los valores por defecto o recibidos
            tipo: criterioTipo,
            valor: criterioValor
        },
        icono,
        recompensa,
    });

    res.status(201).json({
        status: 'success',
        data: {
            logro: nuevoLogro
        }
    });
});

// @desc    Obtener todos los logros
// @route   GET /api/logros
// @access  Public (cualquier usuario podría ver la lista de logros disponibles)
exports.obtenerTodosLosLogros = catchAsync(async (req, res, next) => {
    // Puedes añadir lógica para filtrar por rol/estado aquí si es necesario
    // let query = {};
    // if (req.usuario && (req.usuario.rol !== 'administrador' && req.usuario.rol !== 'terapeuta')) {
    //     query.isActive = true; // Solo mostrar logros activos a usuarios regulares
    // }
    const logros = await Logro.find({}); // O Logro.find(query) si implementas el filtro por rol
    res.status(200).json({
        status: 'success',
        data: {
            logros // Clave PLURAL 'logros' para la lista
        }
    });
});

// @desc    Obtener un logro por ID
// @route   GET /api/logros/:id
// @access  Public
exports.obtenerLogroPorId = catchAsync(async (req, res, next) => {
    const logro = await Logro.findById(req.params.id);

    if (!logro) {
        return next(new AppError('No se encontró ningún logro con ese ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            logro // Clave singular 'logro'
        }
    });
});

// @desc    Actualizar un logro
// @route   PATCH /api/logros/:id
// @access  Private (Admin/Terapeuta)
exports.actualizarLogro = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { nombre, descripcion, isActive } = req.body;

    const criterio = req.body.criterio;
    const icono = req.body.icono;
    const recompensa = req.body.recompensa;

    let logro = await Logro.findById(id);
    if (!logro) {
        return next(new AppError('Logro no encontrado.', 404));
    }

    if (nombre && nombre !== logro.nombre) {
        const logroExistente = await Logro.findOne({ nombre });
        if (logroExistente && logroExistente._id.toString() !== id) {
            return next(new AppError('Ya existe otro logro con este nombre.', 400));
        }
    }

    // Validar el criterio.valor si se proporciona
    if (criterio && criterio.valor !== undefined) {
        if (typeof criterio.valor !== 'number' || isNaN(criterio.valor) || criterio.valor < 0) {
            return next(new AppError('El valor del criterio debe ser un número positivo.', 400));
        }
    }

    const updateFields = {
        nombre,
        descripcion,
        isActive: isActive !== undefined ? isActive : logro.isActive,
    };

    if (criterio && criterio.tipo !== undefined) updateFields['criterio.tipo'] = criterio.tipo;
    if (criterio && criterio.valor !== undefined) updateFields['criterio.valor'] = criterio.valor;
    if (icono !== undefined) updateFields.icono = icono;
    if (recompensa !== undefined) updateFields.recompensa = recompensa;

    const logroActualizado = await Logro.findByIdAndUpdate(
        id,
        updateFields,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            logro: logroActualizado
        }
    });
});

// @desc    Eliminar un logro
// @route   DELETE /api/logros/:id
// @access  Private (Solo Admin)
exports.eliminarLogro = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const logro = await Logro.findByIdAndDelete(id);

    if (!logro) {
        return next(new AppError('No se encontró ningún logro con ese ID para eliminar.', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Logro eliminado exitosamente.'
    });
});