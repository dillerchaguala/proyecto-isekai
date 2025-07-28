// controllers/userController.js
const Usuario = require('../models/User');
const Terapia = require('../models/Terapia');
const Logro = require('../models/Logro');
const { otorgaDesafios } = require('./desafioController'); 

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private (solo usuarios autenticados)
const PerfilUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario._id)
            .select('-contrasena')
            .populate('terapiasCompletadas.terapia', 'titulo descripcion tipo puntosXP')
            .populate('logrosConseguidos.logro')
            .populate('desafiosCompletados.desafio'); 

        if (usuario) {
            res.status(200).json({
                _id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                correoElectronico: usuario.correoElectronico,
                rol: usuario.rol,
                puntosExperiencia: usuario.puntosExperiencia,
                nivelActual: usuario.nivelActual,
                terapiasCompletadas: usuario.terapiasCompletadas,
                logrosConseguidos: usuario.logrosConseguidos,
                desafiosCompletados: usuario.desafiosCompletados, 
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error("Error en PerfilUsuario:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al obtener el perfil de usuario.' });
    }
};

// @desc    Marcar una terapia como completada por el usuario
// @route   POST /api/users/complete-therapy
// @access  Private (Solo pacientes)
const TareaCompletada = async (req, res) => {
    const { idTerapia } = req.body;
    const usuarioId = req.usuario._id;
    const rolUsuario = req.usuario.rol;

    if (rolUsuario !== 'paciente') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los pacientes pueden marcar terapias como completadas.' });
    }

    try {
        const usuario = await Usuario.findById(usuarioId)
            .populate('terapiasCompletadas.terapia', 'titulo descripcion tipo puntosXP')
            .populate('logrosConseguidos.logro')
            .populate('desafiosCompletados.desafio'); 

        const terapia = await Terapia.findById(idTerapia);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (!terapia) {
            return res.status(404).json({ message: 'Terapia no encontrada.' });
        }

        if (terapia.estado !== 'activo') {
            return res.status(400).json({ message: 'Esta terapia no está activa y no puede ser completada.' });
        }

        if (usuario.nivelActual < terapia.nivelRequerido) {
            return res.status(400).json({ message: `Necesitas ser al menos Nivel ${terapia.nivelRequerido} para completar esta terapia.` });
        }

        const yaCompletada = usuario.terapiasCompletadas.some(
            (item) => item.terapia._id.toString() === idTerapia
        );

        if (yaCompletada) {
            return res.status(400).json({ message: 'Ya has completado esta terapia anteriormente.' });
        }

        usuario.terapiasCompletadas.push({
            terapia: terapia._id,
            xpGanado: terapia.puntosXP,
            fechaCompletado: new Date(),
        });

        usuario.puntosExperiencia += terapia.puntosXP;

        const xpParaSiguienteNivel = { 1: 200, 2: 500, 3: 1000 };
        let nuevoNivel = usuario.nivelActual;
        while (xpParaSiguienteNivel[nuevoNivel] && usuario.puntosExperiencia >= xpParaSiguienteNivel[nuevoNivel]) {
            nuevoNivel++;
            usuario.nivelActual = nuevoNivel;
        }

        await usuario.save();

        await otorgarLogros(usuario);
        await otorgaDesafios(usuario, 'terapiasCompletadas', usuario.terapiasCompletadas.length); 
        await otorgaDesafios(usuario, 'xpGanado', usuario.puntosExperiencia); 

        const usuarioActualizadoParaRespuesta = await Usuario.findById(usuarioId)
            .select('-contrasena')
            .populate('terapiasCompletadas.terapia', 'titulo descripcion tipo puntosXP')
            .populate('logrosConseguidos.logro')
            .populate('desafiosCompletados.desafio'); 

        res.status(200).json({
            message: 'Terapia marcada como completada exitosamente.',
            usuario: {
                _id: usuarioActualizadoParaRespuesta._id,
                nombreUsuario: usuarioActualizadoParaRespuesta.nombreUsuario,
                puntosExperiencia: usuarioActualizadoParaRespuesta.puntosExperiencia,
                nivelActual: usuarioActualizadoParaRespuesta.nivelActual,
                terapiasCompletadas: usuarioActualizadoParaRespuesta.terapiasCompletadas,
                logrosConseguidos: usuarioActualizadoParaRespuesta.logrosConseguidos,
                desafiosCompletados: usuarioActualizadoParaRespuesta.desafiosCompletados, 
            },
        });

    } catch (error) {
        console.error("Error en TareaCompletada:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de usuario o terapia no válido.' });
        }
        res.status(500).json({ message: 'Error del servidor al marcar la terapia como completada.' });
    }
};

const otorgarLogros = async (usuario) => {
    try {
        const todosLosLogros = await Logro.find({});
        const logrosActualesIds = usuario.logrosConseguidos.map(lc => lc.logro._id.toString());
        let logrosOtorgadosEnEstaRonda = 0;

        for (const logro of todosLosLogros) {
            if (logrosActualesIds.includes(logro._id.toString())) {
                continue;
            }

            let criterioCumplido = false;
            switch (logro.criterio.tipo) {
                case 'terapiasCompletadas':
                    if (usuario.terapiasCompletadas.length >= logro.criterio.valor) { criterioCumplido = true; }
                    break;
                case 'nivelAlcanzado':
                    if (usuario.nivelActual >= logro.criterio.valor) { criterioCumplido = true; }
                    break;
                case 'xpAcumulado':
                    if (usuario.puntosExperiencia >= logro.criterio.valor) { criterioCumplido = true; }
                    break;
                default:
                    console.warn(`Tipo de criterio de logro desconocido: ${logro.criterio.tipo}`);
                    break;
            }

            if (criterioCumplido) {
                usuario.logrosConseguidos.push({
                    logro: logro._id,
                    fechaConseguido: new Date(),
                });
                console.log(`Logro conseguido por ${usuario.nombreUsuario}: ${logro.nombre}`);
                logrosOtorgadosEnEstaRonda++;
            }
        }

        if (logrosOtorgadosEnEstaRonda > 0) {
            await usuario.save();
            console.log(`Usuario ${usuario.nombreUsuario} actualizado con ${logrosOtorgadosEnEstaRonda} logros nuevos.`);
        }

    } catch (error) {
        console.error("Error en otorgarLogros:", error.message);
    }
};

module.exports = {
    PerfilUsuario,
    TareaCompletada,
};