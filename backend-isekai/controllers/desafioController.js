const Desafio = require('../models/Desafio');
const Usuario = require('../models/User'); // Asegúrate de que este es el nombre correcto de tu modelo de Usuario ('Usuario' si lo exportaste así)

// --- Funciones Auxiliares ---

// Función para verificar si un desafío ya fue completado por el usuario en el período de tiempo dado.
// No necesita cambios directos relacionados con el CRUD Manager, pero es fundamental para la lógica del juego.
const DesafioCompletado = (usuario, desafio, fechaActual) => {
    // Si la frecuencia es 'unico', verifica si ya ha sido completado alguna vez.
    if (desafio.frecuencia === 'unico') {
        return usuario.desafiosCompletados.some(
            (item) => item.desafio.toString() === desafio._id.toString()
        );
    }

    // Para desafíos diarios o semanales, calculamos el inicio del período actual.
    const hoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Establece la fecha al inicio de la semana (domingo por defecto)

    return usuario.desafiosCompletados.some((item) => {
        // Solo considera los items que corresponden a este desafío específico.
        if (item.desafio.toString() === desafio._id.toString()) {
            const fechaCompletado = new Date(item.fechaCompletado);
            if (desafio.frecuencia === 'diario') {
                // Para desafíos diarios, verifica si se completó hoy.
                return (
                    fechaCompletado.getFullYear() === hoy.getFullYear() &&
                    fechaCompletado.getMonth() === hoy.getMonth() &&
                    fechaCompletado.getDate() === hoy.getDate()
                );
            }
            if (desafio.frecuencia === 'semanal') {
                // Para desafíos semanales, verifica si se completó en la semana actual.
                const fechaCompletadoInicioSemana = new Date(fechaCompletado);
                fechaCompletadoInicioSemana.setDate(fechaCompletado.getDate() - fechaCompletado.getDay());
                return fechaCompletadoInicioSemana.getTime() === inicioSemana.getTime();
            }
        }
        return false;
    });
};

// @desc    Verifica y otorga desafíos a un usuario basado en una acción.
// Esta función es llamada internamente cuando un usuario realiza una acción relevante.
const otorgaDesafios = async (usuario, tipoAccion, valorAccion) => {
    try {
        // Importante: Solo consideramos desafíos que están activos (`isActive: true`).
        const desafiosDisponibles = await Desafio.find({ isActive: true });

        let desafiosOtorgadosEnEstaRonda = 0;
        const fechaActual = new Date();

        for (const desafio of desafiosDisponibles) {
            // Si el desafío ya fue completado en el período actual, lo saltamos.
            if (DesafioCompletado(usuario, desafio, fechaActual)) {
                continue;
            }

            let criterioCumplido = false;

            // Evaluamos si el criterio del desafío ha sido cumplido.
            // Nota: Aquí se asume que 'valorAccion' es una métrica acumulativa o el total de algo.
            switch (desafio.tipo) {
                case 'terapiasCompletadas':
                case 'xpGanado':
                case 'registroAnimo': // Asegúrate de que tu lógica de 'valorAccion' para registroAnimo sea coherente (ej., número de registros).
                    if (valorAccion >= desafio.valorRequerido) {
                        criterioCumplido = true;
                    }
                    break;
                case 'nivelAlcanzado': // Si implementas este tipo de desafío, actualiza la lógica aquí
                    if (usuario.nivelActual >= desafio.valorRequerido) {
                        criterioCumplido = true;
                    }
                    break;
                case 'ninguno': // Si hay desafíos sin criterio específico (solo otorgados manualmente o por otra lógica)
                    // No hace nada, ya que no hay un criterio automático.
                    break;
                // Puedes añadir más casos para otros tipos de desafíos ('meditacionMinutos', etc.)
                default:
                    console.log(`Tipo de desafío desconocido: ${desafio.tipo}`);
            }

            // Si el criterio se cumplió, registramos el desafío como completado.
            if (criterioCumplido) {
                usuario.desafiosCompletados.push({
                    desafio: desafio._id,
                    fechaCompletado: fechaActual,
                });
                usuario.puntosExperiencia += desafio.recompensaXP; // Otorgamos la recompensa de XP.
                console.log(`Desafío completado por ${usuario.nombreUsuario}: ${desafio.nombre}. XP ganado: ${desafio.recompensaXP}`);
                desafiosOtorgadosEnEstaRonda++;
            }
        }

        // Si se otorgaron nuevos desafíos en esta ronda, actualizamos al usuario.
        if (desafiosOtorgadosEnEstaRonda > 0) {
            // Lógica de subida de nivel. Asegúrate de tener un mapa completo de XP por nivel.
            const xpParaSiguienteNivel = {
                1: 200,
                2: 500,
                3: 1000,
                4: 1800,
                5: 2800,
                // ... y así sucesivamente para más niveles.
            };
            let nuevoNivel = usuario.nivelActual;
            while (xpParaSiguienteNivel[nuevoNivel] && usuario.puntosExperiencia >= xpParaSiguienteNivel[nuevoNivel]) {
                nuevoNivel++;
                usuario.nivelActual = nuevoNivel;
            }
            await usuario.save(); // Guardamos los cambios en el usuario (XP, nivel, desafíos completados).
            console.log(`Usuario ${usuario.nombreUsuario} actualizado con ${desafiosOtorgadosEnEstaRonda} desafíos nuevos. XP total: ${usuario.puntosExperiencia}, Nivel: ${usuario.nivelActual}`);
        }

    } catch (error) {
        console.error("Error en otorgaDesafios:", error.message);
        // Aquí no se envía una respuesta HTTP ya que es una función interna.
    }
};

// --- Funciones CRUD para Desafíos ---

/**
 * @desc    Crea un nuevo desafío
 * @route   POST /api/desafios
 * @access  Private (Admin/Terapeuta - el rol es verificado por middleware)
 */
const crearDesafio = async (req, res) => {
    // Desestructuramos solo los campos que se espera recibir del frontend CrudManager
    // ('nombre', 'descripcion', 'isActive'). Los demás campos del modelo de Desafío
    // ('tipo', 'valorRequerido', 'recompensaXP', 'frecuencia') tienen valores por defecto o son opcionales
    // en el modelo, lo que permite que el CRUD genérico funcione.
    const { nombre, descripcion, isActive } = req.body;

    // Validamos que los campos esenciales estén presentes.
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'Nombre y descripción del desafío son obligatorios.' });
    }

    try {
        // Verificamos si ya existe un desafío con el mismo nombre para asegurar la unicidad.
        const desafioExistente = await Desafio.findOne({ nombre });
        if (desafioExistente) {
            return res.status(400).json({ message: 'Ya existe un desafío con este nombre.' });
        }

        // Creamos el desafío. Los campos no proporcionados por el frontend usarán sus valores por defecto
        // definidos en el esquema del modelo Desafio.
        const desafio = await Desafio.create({
            nombre,
            descripcion,
            isActive: isActive !== undefined ? isActive : false, // Aseguramos que isActive se asigne correctamente.
            // Nota: 'fechaCreacion' ya no es necesario aquí si usas 'timestamps: true' en tu modelo
            // porque Mongoose crea 'createdAt' automáticamente.
        });

        // Respondemos con el desafío creado.
        res.status(201).json({
            status: 'success',
            data: {
                desafio // Clave singular 'desafio' para un solo objeto.
            }
        });
    } catch (error) {
        console.error("Error al crear desafío:", error.message);
        // Manejo específico para errores de duplicidad de nombre.
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un desafío con este nombre.' });
        }
        // Manejo de errores de validación del esquema de Mongoose.
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        res.status(500).json({ message: 'Error del servidor al crear el desafío.' });
    }
};

/**
 * @desc    Obtiene todos los desafíos
 * @route   GET /api/desafios
 * @access  Public (Todos los usuarios autenticados y no autenticados, pero con filtro isActive para no-admin/terapeutas)
 */
const obtenerDesafios = async (req, res) => {
    let query = {};
    const rolUsuario = req.usuario ? req.usuario.rol : null; // Asumimos que req.usuario viene del middleware de autenticación.

    // Si el usuario no es 'administrador' ni 'terapeuta', solo debe ver los desafíos que están activos.
    if (rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
        query.isActive = true;
    }

    try {
        // Buscamos desafíos aplicando el filtro (si existe) o todos si es un admin/terapeuta.
        const desafios = await Desafio.find(query);

        // Respondemos con la lista de desafíos.
        res.status(200).json({
            status: 'success',
            results: desafios.length, // Incluimos el número de resultados.
            data: {
                desafios: desafios // Clave PLURAL 'desafios' para la lista.
            }
        });
    } catch (error) {
        console.error("Error al obtener desafíos:", error.message);
        res.status(500).json({ message: 'Error del servidor al obtener los desafíos.' });
    }
};

/**
 * @desc    Obtiene un desafío por ID
 * @route   GET /api/desafios/:id
 * @access  Public (si está activo), Private (Admin/Terapeuta para cualquier estado)
 */
const obtenerDesafioPorId = async (req, res) => {
    try {
        const desafio = await Desafio.findById(req.params.id);

        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }

        const rolUsuario = req.usuario ? req.usuario.rol : null;
        // Si el desafío no está activo Y el usuario NO es un administrador ni terapeuta, denegamos el acceso.
        if (!desafio.isActive && rolUsuario !== 'administrador' && rolUsuario !== 'terapeuta') {
            return res.status(403).json({ message: 'Acceso denegado: El desafío no está activo o no tienes permisos para verlo.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                desafio // Clave singular 'desafio' para un solo objeto.
            }
        });
    } catch (error) {
        console.error("Error al obtener desafío por ID:", error.message);
        // Manejo de error si el ID no es un formato válido de MongoDB ObjectId.
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener el desafío.' });
    }
};

/**
 * @desc    Actualiza un desafío existente
 * @route   PUT /api/desafios/:id (o PATCH si el comportamiento es parcial)
 * @access  Private (Admin/Terapeuta - rol verificado por middleware)
 */
const actualizarDesafio = async (req, res) => {
    // Desestructuramos los campos que el frontend CrudManager enviará para actualización.
    const { nombre, descripcion, isActive } = req.body;

    try {
        let desafio = await Desafio.findById(req.params.id);

        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }

        // Si se intenta cambiar el nombre, verificamos que el nuevo nombre no esté ya en uso.
        if (nombre && nombre !== desafio.nombre) {
            const desafioExistente = await Desafio.findOne({ nombre });
            // Aseguramos que el nombre duplicado no pertenezca a la misma actividad que estamos actualizando.
            if (desafioExistente && String(desafioExistente._id) !== String(desafio._id)) {
                return res.status(400).json({ message: 'Ya existe otro desafío con este nombre.' });
            }
        }

        // Actualizamos los campos solo si se proporcionan en el cuerpo de la solicitud.
        // Esto permite actualizaciones parciales.
        desafio.nombre = nombre !== undefined ? nombre : desafio.nombre;
        desafio.descripcion = descripcion !== undefined ? descripcion : desafio.descripcion;
        desafio.isActive = isActive !== undefined ? isActive : desafio.isActive;

        // NOTA: Si necesitas que los campos 'tipo', 'valorRequerido', 'recompensaXP', 'frecuencia'
        // también sean actualizables desde el CRUD del frontend, DEBES agregarlos al 'desafioConfig.fields'
        // y también desestructurarlos de `req.body` y asignarlos aquí.
        // Por ahora, se mantendrán los valores existentes si no se envían.

        const desafioActualizado = await desafio.save();

        res.status(200).json({
            status: 'success',
            data: {
                desafio: desafioActualizado // Clave singular para un solo objeto.
            }
        });
    } catch (error) {
        console.error("Error al actualizar desafío:", error.message);
        // Manejo de errores de duplicidad o validación.
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un desafío con este nombre.' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        // Manejo de error si el ID no es un formato válido de MongoDB ObjectId.
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al actualizar el desafío.' });
    }
};

/**
 * @desc    Elimina un desafío
 * @route   DELETE /api/desafios/:id
 * @access  Private (Admin/Terapeuta - rol verificado por middleware)
 */
const eliminarDesafio = async (req, res) => {
    try {
        const desafio = await Desafio.findById(req.params.id);

        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }

        await Desafio.deleteOne({ _id: req.params.id });

        res.status(200).json({ status: 'success', message: 'Desafío eliminado exitosamente.' });
    } catch (error) {
        console.error("Error al eliminar desafío:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al eliminar el desafío.' });
    }
};

// Exportamos todas las funciones del controlador para que puedan ser utilizadas por las rutas.
module.exports = {
    crearDesafio,
    obtenerDesafios,       // Renombrado de TodosLosDesafios a obtenerDesafios para consistencia
    obtenerDesafioPorId,
    actualizarDesafio,
    eliminarDesafio,
    otorgaDesafios,        // Esta función es interna y se llamará desde otros controladores (ej. userController)
};