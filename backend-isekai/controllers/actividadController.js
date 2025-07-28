// backend-isekai/controllers/actividadController.js
const Actividad = require('../models/Actividad'); // Importamos el modelo de Actividad

/**
 * @desc    Crea una nueva actividad
 * @route   POST /api/actividades
 * @access  Private (Admin/Terapeuta - el rol es verificado por el middleware 'autorizarRol' en la ruta)
 */
const crearActividad = async (req, res) => {
    const { nombre, descripcion, urlRecurso, isActive } = req.body;

    // Validación básica: aseguramos que los campos esenciales no estén vacíos.
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'Nombre y descripción son campos obligatorios.' });
    }

    try {
        // Verificamos si ya existe una actividad con el mismo nombre para evitar duplicados.
        const actividadExistente = await Actividad.findOne({ nombre });
        if (actividadExistente) {
            return res.status(400).json({ message: 'Ya existe una actividad con este nombre.' });
        }

        // Creamos una nueva instancia del modelo Actividad con los datos proporcionados.
        const nuevaActividad = new Actividad({
            nombre,
            descripcion,
            urlRecurso,
            // Si 'isActive' no se proporciona en el cuerpo de la solicitud, por defecto será 'true'.
            isActive: isActive !== undefined ? isActive : true,
            // Si tu modelo Actividad tiene un campo 'creadoPor' y quieres registrar al usuario que la creó:
            // creadoPor: req.usuario._id, // Esto asume que 'req.usuario' está disponible del middleware de autenticación
        });

        // Guardamos la nueva actividad en la base de datos.
        const actividadGuardada = await nuevaActividad.save();

        // Respondemos con un estado 201 (Creado) y los datos de la actividad.
        res.status(201).json({
            status: 'success',
            data: {
                actividad: actividadGuardada // Usamos clave singular 'actividad' para un solo objeto
            }
        });

    } catch (error) {
        // Manejo de errores detallado para una mejor depuración y respuesta al cliente.
        console.error("Error al crear actividad:", error.message);
        // Error de duplicidad (código 11000 de MongoDB).
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Error: Ya existe una actividad con este nombre.' });
        }
        // Errores de validación de Mongoose (ej. campos requeridos faltantes o tipos incorrectos).
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        // Cualquier otro tipo de error del servidor.
        res.status(500).json({ message: 'Error del servidor al crear la actividad.' });
    }
};



/**
 * @desc    Obtiene todas las actividades
 * @route   GET /api/actividades
 * @access  Public (solo activas), Private (Admin/Terapeuta para todas)
 */
const obtenerActividades = async (req, res) => {
    let query = {};
    // req.usuario se adjunta por el middleware de autenticación si un token JWT válido está presente.
    // Esto permite que el controlador sepa si hay un usuario logueado y qué rol tiene,
    // incluso si la ruta no está estrictamente protegida por 'protegerRuta'.
    const rolUsuario = req.usuario ? req.usuario.rol : null;

    // Si el usuario no es 'administrador' ni 'terapeuta', solo debe ver las actividades que están activas.
    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        query.isActive = true;
    }

    try {
        // Buscamos actividades aplicando el filtro (si existe para usuarios regulares)
        // o todas las actividades si es un administrador/terapeuta.
        const actividades = await Actividad.find(query);

        // Respondemos con un estado 200 (OK) y la lista de actividades.
        res.status(200).json({
            status: 'success',
            results: actividades.length, // Incluimos el número de resultados para consistencia en la respuesta.
            data: {
                actividades: actividades // Usamos clave PLURAL 'actividades' para la lista.
            }
        });
    } catch (error) {
        console.error("Error al obtener actividades:", error.message);
        res.status(500).json({ message: 'Error del servidor al obtener las actividades.' });
    }
};



/**
 * @desc    Obtiene una actividad específica por ID
 * @route   GET /api/actividades/:id
 * @access  Public (si está activa), Private (Admin/Terapeuta para cualquier estado)
 */
const obtenerActividadPorId = async (req, res) => {
    try {
        // Buscamos una actividad por su ID proporcionado en los parámetros de la URL.
        const actividad = await Actividad.findById(req.params.id);

        // Si no se encuentra la actividad, devolvemos un 404 (No Encontrado).
        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        const rolUsuario = req.usuario ? req.usuario.rol : null;
        // Lógica de autorización: si la actividad no está activa Y el usuario NO es un administrador ni terapeuta,
        // denegamos el acceso. Esto evita que usuarios no autorizados accedan a contenido inactivo.
        if (!actividad.isActive && rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
            // Se devuelve 403 (Prohibido) para indicar que la actividad existe pero el usuario no tiene permisos.
            return res.status(403).json({ message: 'Acceso denegado: La actividad no está activa o no tienes permisos para verla.' });
        }

        // Respondemos con un estado 200 (OK) y los datos de la actividad encontrada.
        res.status(200).json({
            status: 'success',
            data: {
                actividad: actividad // Usamos clave singular 'actividad' para un solo objeto.
            }
        });
    } catch (error) {
        // Manejo de errores.
        console.error("Error al obtener actividad por ID:", error.message);
        // Si el ID proporcionado no es un formato válido de ObjectId de MongoDB.
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener la actividad.' });
    }
};



/**
 * @desc    Actualiza una actividad existente
 * @route   PUT /api/actividades/:id
 * @access  Private (Admin/Terapeuta - rol verificado por middleware 'autorizarRol' en la ruta)
 */
const actualizarActividad = async (req, res) => {
    const { nombre, descripcion, urlRecurso, isActive } = req.body;

    try {
        // Primero, intentamos encontrar la actividad por su ID.
        let actividad = await Actividad.findById(req.params.id);

        // Si no se encuentra la actividad, devolvemos un 404.
        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        // Si se está intentando cambiar el nombre, verificamos que el nuevo nombre no esté ya en uso.
        if (nombre && nombre !== actividad.nombre) {
            const actividadExistente = await Actividad.findOne({ nombre });
            // Nos aseguramos de que el nombre duplicado no pertenezca a la misma actividad que estamos actualizando.
            if (actividadExistente && String(actividadExistente._id) !== String(actividad._id)) {
                return res.status(400).json({ message: 'Ya existe otra actividad con este nombre.' });
            }
        }

        // Actualizamos los campos de la actividad. Usamos el operador ternario para asegurarnos
        // de que solo se actualicen los campos que se proporcionan en el cuerpo de la solicitud.
        actividad.nombre = nombre !== undefined ? nombre : actividad.nombre;
        actividad.descripcion = descripcion !== undefined ? descripcion : actividad.descripcion;
        actividad.urlRecurso = urlRecurso !== undefined ? urlRecurso : actividad.urlRecurso;
        actividad.isActive = isActive !== undefined ? isActive : actividad.isActive;

        // Guardamos los cambios en la base de datos. Esto también actualizará 'updatedAt' automáticamente.
        const actividadActualizada = await actividad.save();

        // Respondemos con un estado 200 (OK) y los datos actualizados de la actividad.
        res.status(200).json({
            status: 'success',
            data: {
                actividad: actividadActualizada // Usamos clave singular para un solo objeto.
            }
        });

    } catch (error) {
        // Manejo de errores detallado.
        console.error("Error al actualizar actividad:", error.message);
        // Error de duplicidad (ej. si se intenta cambiar a un nombre ya existente).
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Error: Nombre de actividad duplicado.' });
        }
        // Errores de validación de Mongoose.
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        // Si el ID proporcionado no es un formato válido de ObjectId.
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        // Otro tipo de error del servidor.
        res.status(500).json({ message: 'Error del servidor al actualizar la actividad.' });
    }
};

/**
 * @desc    Elimina una actividad
 * @route   DELETE /api/actividades/:id
 * @access  Private (Admin/Terapeuta - rol verificado por middleware 'autorizarRol' en la ruta)
 */
const eliminarActividad = async (req, res) => {
    try {
        // Primero, intentamos encontrar la actividad por su ID.
        const actividad = await Actividad.findById(req.params.id);

        // Si no se encuentra la actividad, devolvemos un 404.
        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        // Eliminamos la actividad de la base de datos.
        await Actividad.deleteOne({ _id: req.params.id });

        // Respondemos con un estado 200 (OK) y un mensaje de éxito.
        res.status(200).json({ status: 'success', message: 'Actividad eliminada exitosamente.' });

    } catch (error) {
        // Manejo de errores.
        console.error("Error al eliminar actividad:", error.message);
        // Si el ID no es un formato válido de ObjectId.
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de actividad no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al eliminar la actividad.' });
    }
};

// Exportamos todas las funciones del controlador para que puedan ser usadas por las rutas.
module.exports = {
    crearActividad,
    obtenerActividades,
    obtenerActividadPorId,
    actualizarActividad,
    eliminarActividad
};