// backend-isekai/controllers/userController.js
const Usuario = require('../models/User');
const Terapia = require('../models/Terapia');
const Logro = require('../models/Logro');
const { otorgaDesafios } = require('./desafioController'); // Importa la función otorgaDesafios

// Importamos las utilidades para un manejo de errores consistente
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Obtener perfil de usuario
 * @route   GET /api/users/profile
 * @access  Private (solo usuarios autenticados - rol verificado por middleware)
 */
const PerfilUsuario = catchAsync(async (req, res, next) => {
    // req.usuario._id es proporcionado por el middleware de autenticación (protegerRuta)
    const usuario = await Usuario.findById(req.usuario._id)
        .select('-contrasena') // Excluye la contraseña
        // CAMBIO: Usar 'nombre' en lugar de 'titulo' al poblar terapias
        .populate('terapiasCompletadas.terapia', 'nombre descripcion tipo puntosXP')
        .populate('logrosConseguidos.logro')
        .populate('desafiosCompletados.desafio');

    if (!usuario) {
        return next(new AppError('Usuario no encontrado.', 404));
    }

    // Respuesta consistente con el formato { status: 'success', data: { usuario: ... } }
    res.status(200).json({
        status: 'success',
        data: {
            usuario: {
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
            }
        }
    });
});

/**
 * @desc    Marcar una terapia como completada por el usuario
 * @route   POST /api/users/complete-therapy
 * @access  Private (Solo pacientes - rol verificado por middleware)
 */
const TareaCompletada = catchAsync(async (req, res, next) => {
    const { idTerapia } = req.body;
    const usuarioId = req.usuario._id; // ID del usuario autenticado

    // NO es necesario repetir la validación de rol aquí. El middleware de la ruta
    // (ej. autorizarRol(['paciente'])) ya debe haber verificado el rol.

    const usuario = await Usuario.findById(usuarioId);
    const terapia = await Terapia.findById(idTerapia);

    if (!usuario) {
        return next(new AppError('Usuario no encontrado.', 404));
    }
    if (!terapia) {
        return next(new AppError('Terapia no encontrada.', 404));
    }

    // CAMBIO: Usar !terapia.isActive en lugar de terapia.estado !== 'activo'
    if (!terapia.isActive) {
        return next(new AppError('Esta terapia no está activa y no puede ser completada.', 400));
    }

    // Verificar nivel requerido
    if (usuario.nivelActual < terapia.nivelRequerido) {
        return next(new AppError(`Necesitas ser al menos Nivel ${terapia.nivelRequerido} para completar esta terapia.`, 400));
    }

    // Verificar si la terapia ya fue completada por el usuario
    const yaCompletada = usuario.terapiasCompletadas.some(
        (item) => item.terapia.toString() === idTerapia // Asegúrate de comparar IDs como strings
    );

    if (yaCompletada) {
        return next(new AppError('Ya has completado esta terapia anteriormente.', 400));
    }

    // Añadir la terapia a las terapias completadas del usuario
    usuario.terapiasCompletadas.push({
        terapia: terapia._id,
        xpGanado: terapia.puntosXP,
        fechaCompletado: new Date(),
    });

    // Añadir XP al usuario
    usuario.puntosExperiencia += terapia.puntosXP;

    // Lógica de subida de nivel
    const xpParaSiguienteNivel = {
        1: 200, 2: 500, 3: 1000, 4: 1800, 5: 2800 // Añade más niveles si es necesario
    };
    let nuevoNivel = usuario.nivelActual;
    while (xpParaSiguienteNivel[nuevoNivel] && usuario.puntosExperiencia >= xpParaSiguienteNivel[nuevoNivel]) {
        nuevoNivel++;
        usuario.nivelActual = nuevoNivel;
    }

    // Guardar los cambios en el usuario
    await usuario.save();

    // Otorgar Logros y Desafíos (funciones separadas para mantener la modularidad)
    // No usamos 'await' aquí directamente en estas llamadas, porque no necesitamos que la respuesta HTTP
    // espere a que estas operaciones secundarias se completen. Se ejecutarán en segundo plano.
    // Sin embargo, si la respuesta del usuario necesita estos datos actualizados, sí necesitarías await.
    // Para simplificar, asumimos que la respuesta puede ser ligeramente "eventual".
    // Si la respuesta debe reflejar los logros/desafíos inmediatamente, usa `await` y luego popula.
    await otorgarLogros(usuario); // Aseguramos que los logros se otorguen y se salven en el usuario
    await otorgaDesafios(usuario, 'terapiasCompletadas', usuario.terapiasCompletadas.length);
    await otorgaDesafios(usuario, 'xpGanado', usuario.puntosExperiencia);
    // Nota: otorgaDesafios y otorgarLogros ya salvan al usuario internamente si hay cambios.

    // Obtener el usuario actualizado con todos los `populate` para la respuesta.
    // Realizamos la población DESPUÉS de todos los cambios y el save().
    const usuarioActualizadoParaRespuesta = await Usuario.findById(usuarioId)
        .select('-contrasena')
        // CAMBIO: Usar 'nombre' en lugar de 'titulo' al poblar terapias
        .populate('terapiasCompletadas.terapia', 'nombre descripcion tipo puntosXP')
        .populate('logrosConseguidos.logro')
        .populate('desafiosCompletados.desafio');

    // Respuesta consistente
    res.status(200).json({
        status: 'success',
        message: 'Terapia marcada como completada exitosamente.',
        data: {
            usuario: {
                _id: usuarioActualizadoParaRespuesta._id,
                nombreUsuario: usuarioActualizadoParaRespuesta.nombreUsuario,
                puntosExperiencia: usuarioActualizadoParaRespuesta.puntosExperiencia,
                nivelActual: usuarioActualizadoParaRespuesta.nivelActual,
                terapiasCompletadas: usuarioActualizadoParaRespuesta.terapiasCompletadas,
                logrosConseguidos: usuarioActualizadoParaRespuesta.logrosConseguidos,
                desafiosCompletados: usuarioActualizadoParaRespuesta.desafiosCompletados,
            },
        },
    });
});

/**
 * @desc    Función auxiliar para otorgar logros.
 * Es llamada internamente por `TareaCompletada` y podría ser llamada por otras funciones.
 */
const otorgarLogros = catchAsync(async (usuario) => {
    // Los logros solo se otorgarán si están activos.
    const todosLosLogros = await Logro.find({ isActive: true });
    // Aseguramos que logro._id sea un string para la comparación
    const logrosActualesIds = usuario.logrosConseguidos.map(lc => lc.logro.toString());
    let logrosOtorgadosEnEstaRonda = 0;

    for (const logro of todosLosLogros) {
        if (logrosActualesIds.includes(logro._id.toString())) {
            continue; // Ya tiene este logro
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
            // Si hay otros tipos de criterios, añádelos aquí.
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
        // Solo guardamos si hubo cambios para evitar escrituras innecesarias en la DB
        await usuario.save();
        console.log(`Usuario ${usuario.nombreUsuario} actualizado con ${logrosOtorgadosEnEstaRonda} logros nuevos.`);
    }
    // No se envía respuesta HTTP desde aquí, ya que es una función auxiliar.
});

module.exports = {
    PerfilUsuario,
    TareaCompletada,
};