const Actividad = require('../models/Actividad'); // Importa el modelo de Actividad

// @desc    Crear una nueva actividad
// @route   POST /api/actividades
// @access  Private (Admin/Terapeuta)
const crearActividad = async (req, res) => {
    // Aquí puedes añadir validación de rol si lo deseas, similar a Terapia.
    // const rolUsuario = req.usuario.rol;
    // if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
    //     return res.status(403).json({ message: 'Acceso denegado.' });
    // }

    const { nombre, descripcion, urlRecurso, isActive } = req.body;

    // Validación básica
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'Nombre y descripción son campos obligatorios.' });
    }

    try {
        // Verificar si una actividad con el mismo nombre ya existe
        const actividadExistente = await Actividad.findOne({ nombre });
        if (actividadExistente) {
            return res.status(400).json({ message: 'Ya existe una actividad con este nombre.' });
        }

        const nuevaActividad = new Actividad({
            nombre,
            descripcion,
            urlRecurso,
            isActive: isActive !== undefined ? isActive : true, // Por defecto activa si no se especifica
            // creadoPor: req.usuario._id, // Si añades el campo 'creadoPor' al modelo
        });

        const actividadGuardada = await nuevaActividad.save();
        res.status(201).json({
            status: 'success',
            data: {
                actividad: actividadGuardada // Clave singular para un solo objeto
            }
        });

    } catch (error) {
        console.error("Error al crear actividad:", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Error: Nombre de actividad duplicado.' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        res.status(500).json({ message: 'Error del servidor al crear la actividad.' });
    }
};

// @desc    Obtener todas las actividades
// @route   GET /api/actividades
// @access  Public (solo activas), Private (Admin/Terapeuta para todas)
const obtenerActividades = async (req, res) => {
    // Aquí puedes añadir lógica para filtrar por rol, similar a Terapia
    // const rolUsuario = req.usuario ? req.usuario.rol : null;
    // let query = {};
    // if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
    //     query.isActive = true;
    // }

    try {
        const actividades = await Actividad.find({}); // O Actividad.find(query) si implementas el filtro por rol
        res.status(200).json({
            status: 'success',
            data: {
                actividades: actividades // Clave PLURAL 'actividades' para la lista
            }
        });
    } catch (error) {
        console.error("Error al obtener actividades:", error.message);
        res.status(500).json({ message: 'Error del servidor al obtener las actividades.' });
    }
};

// @desc    Obtener una actividad por ID
// @route   GET /api/actividades/:id
// @access  Public (si está activa), Private (Admin/Terapeuta para cualquier estado)
const obtenerActividadPorId = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }
        // Puedes añadir aquí la lógica de verificación de 'isActive' y rol si es necesario
        res.status(200).json({
            status: 'success',
            data: {
                actividad: actividad // Clave singular 'actividad'
            }
        });
    } catch (error) {
        console.error("Error al obtener actividad por ID:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener la actividad.' });
    }
};

// @desc    Actualizar una actividad
// @route   PUT /api/actividades/:id
// @access  Private (Admin/Terapeuta)
const actualizarActividad = async (req, res) => {
    // Aquí puedes añadir validación de rol si lo deseas
    const { nombre, descripcion, urlRecurso, isActive } = req.body;

    try {
        let actividad = await Actividad.findById(req.params.id);

        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        // Si el nombre se está actualizando, verifica si el nuevo nombre ya existe
        if (nombre && nombre !== actividad.nombre) {
            const actividadExistente = await Actividad.findOne({ nombre });
            if (actividadExistente) {
                return res.status(400).json({ message: 'Ya existe otra actividad con este nombre.' });
            }
        }

        // Actualizar campos
        actividad.nombre = nombre !== undefined ? nombre : actividad.nombre;
        actividad.descripcion = descripcion !== undefined ? descripcion : actividad.descripcion;
        actividad.urlRecurso = urlRecurso !== undefined ? urlRecurso : actividad.urlRecurso;
        actividad.isActive = isActive !== undefined ? isActive : actividad.isActive;

        const actividadActualizada = await actividad.save();
        res.status(200).json({
            status: 'success',
            data: {
                actividad: actividadActualizada // Clave singular 'actividad'
            }
        });

    } catch (error) {
        console.error("Error al actualizar actividad:", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Error: Nombre de actividad duplicado.' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al actualizar la actividad.' });
    }
};

// @desc    Eliminar una actividad
// @route   DELETE /api/actividades/:id
// @access  Private (Admin/Terapeuta)
const eliminarActividad = async (req, res) => {
    // Aquí puedes añadir validación de rol si lo deseas
    try {
        const actividad = await Actividad.findById(req.params.id);

        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        await Actividad.deleteOne({ _id: req.params.id });
        res.status(200).json({ status: 'success', message: 'Actividad eliminada exitosamente.' });

    } catch (error) {
        console.error("Error al eliminar actividad:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al eliminar la actividad.' });
    }
};


module.exports = {
    crearActividad,
    obtenerActividades,
    obtenerActividadPorId,
    actualizarActividad,
    eliminarActividad
};