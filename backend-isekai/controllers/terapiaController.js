const Terapia = require('../models/Terapia'); // Importa el modelo de Terapia

// @desc    Crear un nuevo módulo de terapia
// @route   POST /api/terapias
// @access  Private (Admin/Terapeuta)
const crearTerapia = async (req, res) => {
    // CAMBIO 1: Ajusta los nombres de las variables para que coincidan con el frontend
    //          y añade 'duracionMinutos', 'costo', 'isActive'
    const { nombre, descripcion, tipo, duracionMinutos, costo, isActive, contenidoURL, textoCompleto, puntosXP, nivelRequerido } = req.body;

    const creadoPor = req.usuario._id;
    const rolUsuario = req.usuario.rol;

    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores o terapeutas pueden crear terapias.' });
    }

    try {
        // CAMBIO 2: Usa 'nombre' en lugar de 'titulo' para la verificación de existencia
        const terapiaExistente = await Terapia.findOne({ nombre });
        if (terapiaExistente) {
            return res.status(400).json({ message: 'Ya existe una terapia con este nombre.' });
        }

        const nuevaTerapia = new Terapia({
            // CAMBIO 3: Asigna los nuevos campos al crear la terapia
            nombre, // Usar 'nombre' en lugar de 'titulo'
            descripcion,
            tipo,
            duracionMinutos, // Añadido
            costo,           // Añadido
            isActive: isActive !== undefined ? isActive : false, // Añadido, asegura que sea booleano
            contenidoURL,
            textoCompleto,
            puntosXP,
            nivelRequerido,
            // Eliminado 'estado', ahora se maneja con 'isActive'
            creadoPor
        });

        const terapiaGuardada = await nuevaTerapia.save();
        // CAMBIO 4: Envuelve la respuesta en un objeto 'data' con la clave 'terapia' (singular)
        //          Esto se espera para la creación/actualización de un solo recurso en el frontend
        res.status(201).json({
            status: 'success',
            data: {
                terapia: terapiaGuardada // Clave singular para un solo objeto
            }
        });

    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') { // Mongoose Validation Error
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        res.status(500).json({ message: 'Error del servidor al crear la terapia.' });
    }
};

// @desc    Obtener todas las terapias (o filtradas por isActive)
// @route   GET /api/terapias
// @access  Public (solo terapias activas), Private (Admin/Terapeuta para todas)
const obtenerTerapias = async (req, res) => {
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    try {
        let query = {};
        // CAMBIO 5: Usa 'isActive' en lugar de 'estado' para filtrar
        if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
            query.isActive = true; // Solo activas para usuarios no-admin/terapeuta
        }

        const terapias = await Terapia.find(query).populate('creadoPor', 'nombreUsuario correoElectronico rol');
        // CAMBIO 6: Envuelve la respuesta en un objeto 'data' con la clave 'terapias' (plural)
        res.status(200).json({
            status: 'success',
            data: {
                terapias // <-- ¡Esta clave debe ser 'terapias' (plural)!
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error del servidor al obtener las terapias.' });
    }
};

// @desc    Obtener una terapia por ID
// @route   GET /api/terapias/:id
// @access  Public (si está activa), Private (Admin/Terapeuta para cualquier estado)
const obtenerTerapiaPorId = async (req, res) => {
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    try {
        const terapia = await Terapia.findById(req.params.id).populate('creadoPor', 'nombreUsuario correoElectronico rol');

        if (!terapia) {
            return res.status(404).json({ message: 'Terapia no encontrada.' });
        }

        // CAMBIO 7: Usa 'isActive' en lugar de 'estado' para la verificación de acceso
        if (!terapia.isActive && rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
            return res.status(403).json({ message: 'Acceso denegado. Esta terapia no está activa.' });
        }

        // CAMBIO 8: Envuelve la respuesta en un objeto 'data' con la clave 'terapia' (singular)
        res.status(200).json({
            status: 'success',
            data: {
                terapia // Clave singular para un solo objeto
            }
        });

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de terapia no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener la terapia.' });
    }
};

// @desc    Actualizar un módulo de terapia
// @route   PUT /api/terapias/:id
// @access  Private (Admin/Terapeuta)
const actualizarTerapia = async (req, res) => {
    // CAMBIO 9: Ajusta los nombres de las variables para que coincidan con el frontend
    //          y añade 'duracionMinutos', 'costo', 'isActive'
    const { nombre, descripcion, tipo, duracionMinutos, costo, isActive, contenidoURL, textoCompleto, puntosXP, nivelRequerido } = req.body;
    const rolUsuario = req.usuario.rol;

    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores o terapeutas pueden actualizar terapias.' });
    }

    try {
        let terapia = await Terapia.findById(req.params.id);

        if (!terapia) {
            return res.status(404).json({ message: 'Terapia no encontrada.' });
        }

        // CAMBIO 10: Actualiza campos usando los nuevos nombres
        terapia.nombre = nombre !== undefined ? nombre : terapia.nombre; // Usar 'nombre' en lugar de 'titulo'
        terapia.descripcion = descripcion !== undefined ? descripcion : terapia.descripcion;
        terapia.tipo = tipo !== undefined ? tipo : terapia.tipo;
        terapia.duracionMinutos = duracionMinutos !== undefined ? duracionMinutos : terapia.duracionMinutos; // Añadido
        terapia.costo = costo !== undefined ? costo : terapia.costo; // Añadido
        terapia.isActive = isActive !== undefined ? isActive : terapia.isActive; // Añadido, usar para checkbox
        terapia.contenidoURL = contenidoURL !== undefined ? contenidoURL : terapia.contenidoURL;
        terapia.textoCompleto = textoCompleto !== undefined ? textoCompleto : terapia.textoCompleto;
        terapia.puntosXP = puntosXP !== undefined ? puntosXP : terapia.puntosXP;
        terapia.nivelRequerido = nivelRequerido !== undefined ? nivelRequerido : terapia.nivelRequerido;
        // Eliminado 'estado', ahora se maneja con 'isActive'
        // ultimaActualizacion se actualiza automáticamente por el middleware pre-save

        const terapiaActualizada = await terapia.save();
        // CAMBIO 11: Envuelve la respuesta en un objeto 'data' con la clave 'terapia' (singular)
        res.status(200).json({
            status: 'success',
            data: {
                terapia: terapiaActualizada // Clave singular para un solo objeto
            }
        });

    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de terapia no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al actualizar la terapia.' });
    }
};

// @desc    Eliminar un módulo de terapia
// @route   DELETE /api/terapias/:id
// @access  Private (Admin/Terapeuta)
const eliminarTerapia = async (req, res) => {
    const rolUsuario = req.usuario.rol;

    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores o terapeutas pueden eliminar terapias.' });
    }

    try {
        const terapia = await Terapia.findById(req.params.id);

        if (!terapia) {
            return res.status(404).json({ message: 'Terapia no encontrada.' });
        }

        await Terapia.deleteOne({ _id: req.params.id });
        // CAMBIO 12: Envuelve la respuesta de eliminación para consistencia (opcional, pero buena práctica)
        res.status(200).json({ status: 'success', message: 'Terapia eliminada exitosamente.' });

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de terapia no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al eliminar la terapia.' });
    }
};

module.exports = {
    crearTerapia,
    obtenerTerapias,
    obtenerTerapiaPorId,
    actualizarTerapia,
    eliminarTerapia
};