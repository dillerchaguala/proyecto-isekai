const Desafio = require('../models/Desafio');
const Usuario = require('../models/User');

// Función auxiliar para verificar si un desafío ya fue completado por el usuario en el período de tiempo dado
// Esta función no necesita cambios directos relacionados con el CRUD Manager
const DesafioCompletado = (usuario, desafio, fechaActual) => {
    if (desafio.frecuencia === 'unico') {
        return usuario.desafiosCompletados.some(
            (item) => item.desafio.toString() === desafio._id.toString()
        );
    }

    const hoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());

    return usuario.desafiosCompletados.some((item) => {
        if (item.desafio.toString() === desafio._id.toString()) {
            const fechaCompletado = new Date(item.fechaCompletado);
            if (desafio.frecuencia === 'diario') {
                return (
                    fechaCompletado.getFullYear() === hoy.getFullYear() &&
                    fechaCompletado.getMonth() === hoy.getMonth() &&
                    fechaCompletado.getDate() === hoy.getDate()
                );
            }
            if (desafio.frecuencia === 'semanal') {
                const fechaCompletadoInicioSemana = new Date(fechaCompletado);
                fechaCompletadoInicioSemana.setDate(fechaCompletado.getDate() - fechaCompletado.getDay());
                return fechaCompletadoInicioSemana.getTime() === inicioSemana.getTime();
            }
        }
        return false;
    });
};

// VERIFICAR Y OTORGAR DESAFÍOS
// Esta función no necesita cambios directos relacionados con el CRUD Manager,
// pero asegúrate de que maneje el nuevo campo 'isActive' si solo se deben otorgar desafíos activos.
// Actualmente, Desafio.find({}) obtendrá todos. Si quieres filtrar, añade query.isActive = true.
const otorgaDesafios = async (usuario, tipoAccion, valorAccion) => {
    try {
        // CAMBIO POTENCIAL: Filtrar solo desafíos activos si es lo que quieres otorgar
        const desafiosDisponibles = await Desafio.find({ isActive: true }); // Obtener solo desafíos activos

        let desafiosOtorgadosEnEstaRonda = 0;
        const fechaActual = new Date();

        for (const desafio of desafiosDisponibles) {
            if (DesafioCompletado(usuario, desafio, fechaActual)) {
                continue;
            }

            let criterioCumplido = false;

            switch (desafio.tipo) {
                case 'terapiasCompletadas':
                case 'xpGanado':
                    if (valorAccion >= desafio.valorRequerido) {
                        criterioCumplido = true;
                    }
                    break;
                case 'registroAnimo':
                    if (valorAccion >= desafio.valorRequerido) {
                        criterioCumplido = true;
                    }
                    break;
            }

            if (criterioCumplido) {
                usuario.desafiosCompletados.push({
                    desafio: desafio._id,
                    fechaCompletado: fechaActual,
                });
                usuario.puntosExperiencia += desafio.recompensaXP;
                console.log(`Desafío completado por ${usuario.nombreUsuario}: ${desafio.nombre}. XP ganado: ${desafio.recompensaXP}`);
                desafiosOtorgadosEnEstaRonda++;
            }
        }

        if (desafiosOtorgadosEnEstaRonda > 0) {
            const xpParaSiguienteNivel = {
                1: 200, 2: 500, 3: 1000,
            };
            let nuevoNivel = usuario.nivelActual;
            while (xpParaSiguienteNivel[nuevoNivel] && usuario.puntosExperiencia >= xpParaSiguienteNivel[nuevoNivel]) {
                nuevoNivel++;
                usuario.nivelActual = nuevoNivel;
            }
            await usuario.save();
            console.log(`Usuario ${usuario.nombreUsuario} actualizado con ${desafiosOtorgadosEnEstaRonda} desafíos nuevos.`);
        }

    } catch (error) {
        console.error("Error en otorgaDesafios:", error.message);
    }
};

// @desc    Crear un nuevo desafío
// @route   POST /api/desafiosDiarios
// @access  Private (Admin/Terapeuta)
const crearDesafio = async (req, res) => {
    try {
        // CAMBIO 1: Ajusta los campos recibidos del frontend
        // Los campos 'tipo', 'valorRequerido', 'recompensaXP', 'frecuencia'
        // no están en desafioConfig.fields, así que no se enviarán directamente desde el formulario del CRUD.
        // Si necesitas que se definan al crear un desafío desde el CRUD, debes agregarlos al desafioConfig.
        // Por ahora, asumimos que solo se envían nombre, descripcion, fechaCreacion, isActive.
        const { nombre, descripcion, fechaCreacion, isActive } = req.body;

        // Si necesitas que 'tipo', 'valorRequerido', 'recompensaXP', 'frecuencia' se establezcan,
        // tendrías que definirlos en tu formulario de frontend (desafioConfig) o asignar valores por defecto aquí.
        // Por ahora, los dejaré fuera de la desestructuración de req.body, y si son obligatorios en tu esquema,
        // deberás proporcionar valores por defecto o quitarlos de 'required' en el esquema.
        // O: Asegurarte de que el frontend CRUD los envíe, o que se asignen aquí con valores por defecto/lógica.
        // POR SIMPLICIDAD DEL CRUD: Solo usaré los que el frontend envía por defecto.

        // CAMBIO 2: Validar que los campos esperados del frontend estén presentes.
        if (!nombre || !descripcion) {
            return res.status(400).json({ message: 'Nombre y descripción del desafío son obligatorios.' });
        }
        // CAMBIO 3: Asegúrate de que los valores que vienen del frontend se asignen al modelo.
        const desafio = await Desafio.create({
            nombre,
            descripcion,
            fechaCreacion: fechaCreacion || new Date(), // Asigna fechaCreacion, o Date.now() si no se envía
            isActive: isActive !== undefined ? isActive : false, // Asigna isActive, o false por defecto
            // Si los campos tipo, valorRequerido, recompensaXP, frecuencia son requeridos en tu esquema,
            // Y NO los envías desde el frontend, entonces el controlador DEBE asignarles valores por defecto aquí,
            // O hacerlos no-requeridos en el esquema.
            // Para que este controlador funcione con el esquema actual de Desafio.js:
            tipo: 'terapiasCompletadas', // O un valor por defecto lógico si el frontend no lo envía
            valorRequerido: 1,         // O un valor por defecto lógico
            recompensaXP: 0,           // O un valor por defecto lógico
            frecuencia: 'diario'       // O un valor por defecto lógico
        });

        // CAMBIO 4: Envuelve la respuesta en un objeto 'data' con la clave 'desafio' (singular)
        res.status(201).json({
            status: 'success',
            data: {
                desafio // Clave singular para un solo objeto
            }
        });
    } catch (error) {
        console.error("Error al crear desafío:", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un desafío con este nombre.' });
        }
        // CAMBIO 5: Más detalles en el error si es de validación
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        res.status(500).json({ message: 'Error del servidor al crear el desafío.' });
    }
};

// @desc    Obtener todos los desafíos
// @route   GET /api/desafiosDiarios
// @access  Private (Todos los roles autenticados)
const TodosLosDesafios = async (req, res) => {
    try {
        const desafios = await Desafio.find({});
        // CAMBIO 6: Envuelve la respuesta en un objeto 'data' con la clave 'desafiosDiarios' (plural)
        res.status(200).json({
            status: 'success',
            data: {
                desafiosDiarios: desafios // <-- ¡Esta clave debe ser 'desafiosDiarios' (plural)!
            }
        });
    } catch (error) {
        console.error("Error al obtener desafíos:", error.message);
        res.status(500).json({ message: 'Error del servidor al obtener los desafíos.' });
    }
};

// @desc    Obtener un desafío por ID
// @route   GET /api/desafiosDiarios/:id
// @access  Private (Todos los roles autenticados)
const obtenerDesafioPorId = async (req, res) => {
    try {
        const desafio = await Desafio.findById(req.params.id);
        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }
        // CAMBIO 7: Envuelve la respuesta en un objeto 'data' con la clave 'desafio' (singular)
        res.status(200).json({
            status: 'success',
            data: {
                desafio // Clave singular para un solo objeto
            }
        });
    } catch (error) {
        console.error("Error al obtener desafío por ID:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener el desafío.' });
    }
};

// @desc    Actualizar un desafío
// @route   PUT /api/desafiosDiarios/:id
// @access  Private (Admin/Terapeuta)
const actualizarDesafio = async (req, res) => {
    try {
        // CAMBIO 8: Desestructura los campos que el frontend enviará para actualización
        const { nombre, descripcion, fechaCreacion, isActive } = req.body;

        let desafio = await Desafio.findById(req.params.id);

        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }

        // CAMBIO 9: Actualiza los campos recibidos
        desafio.nombre = nombre !== undefined ? nombre : desafio.nombre;
        desafio.descripcion = descripcion !== undefined ? descripcion : desafio.descripcion;
        desafio.fechaCreacion = fechaCreacion !== undefined ? fechaCreacion : desafio.fechaCreacion;
        desafio.isActive = isActive !== undefined ? isActive : desafio.isActive;

        // NOTA: Si necesitas actualizar 'tipo', 'valorRequerido', 'recompensaXP', 'frecuencia'
        // desde el CRUD, debes agregarlos al 'desafioConfig.fields' en el frontend.
        // Si no, no los incluyas en req.body ni en la asignación aquí.

        const desafioActualizado = await desafio.save();
        // CAMBIO 10: Envuelve la respuesta en un objeto 'data' con la clave 'desafio' (singular)
        res.status(200).json({
            status: 'success',
            data: {
                desafio: desafioActualizado // Clave singular para un solo objeto
            }
        });
    } catch (error) {
        console.error("Error al actualizar desafío:", error.message);
        if (error.code === 11000) { // Error de clave duplicada (nombre único)
            return res.status(400).json({ message: 'Ya existe un desafío con este nombre.' });
        }
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: 'Error de validación', errors });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al actualizar el desafío.' });
    }
};

// @desc    Eliminar un desafío
// @route   DELETE /api/desafiosDiarios/:id
// @access  Private (Admin/Terapeuta)
const eliminarDesafio = async (req, res) => {
    try {
        const desafio = await Desafio.findById(req.params.id);

        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado.' });
        }

        await Desafio.deleteOne({ _id: req.params.id });
        // CAMBIO 11: Envuelve la respuesta de eliminación para consistencia
        res.status(200).json({ status: 'success', message: 'Desafío eliminado exitosamente.' });
    } catch (error) {
        console.error("Error al eliminar desafío:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de desafío no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al eliminar el desafío.' });
    }
};


module.exports = {
    crearDesafio,
    TodosLosDesafios,
    obtenerDesafioPorId, // Exporta la nueva función
    actualizarDesafio,   // Exporta la nueva función
    eliminarDesafio,     // Exporta la nueva función
    otorgaDesafios,
};