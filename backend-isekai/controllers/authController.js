// backend-isekai/controllers/authController.js
const Usuario = require('../models/User'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken');   // Para crear JSON Web Tokens
const AppError = require('../utils/appError'); // Importa tu clase AppError
const catchAsync = require('../utils/catchAsync'); // Importa tu utilidad catchAsync

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const registrarUsuario = catchAsync(async (req, res, next) => {
    const { nombreUsuario, email, contrasena, rol } = req.body; // Obtiene los datos del cuerpo de la petición

    // 1. Validar la entrada (campos requeridos)
    if (!nombreUsuario || !email || !contrasena) {
        return next(new AppError('Por favor, proporciona nombre de usuario, correo electrónico y contraseña.', 400));
    }

    // Opcional: Validar formato de email
    // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //     return next(new AppError('Por favor, proporciona un correo electrónico válido.', 400));
    // }

    // 2. Verificar si el usuario ya existe por correo electrónico o nombre de usuario
    let usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        return next(new AppError('El usuario con este correo electrónico ya existe.', 400));
    }

    usuarioExistente = await Usuario.findOne({ nombreUsuario });
    if (usuarioExistente) {
        return next(new AppError('El nombre de usuario ya está en uso.', 400));
    }

    // 3. Crear un nuevo usuario
    // El middleware pre-save de Mongoose en tu modelo Usuario se encargará de hashear la contraseña.
    const nuevoUsuario = new Usuario({
        nombreUsuario,
        email,
        contrasena,
        rol // Si se envía un rol (ej. 'administrador', 'terapeuta'), lo usa; de lo contrario, usa el valor por defecto 'paciente' del esquema
    });

    // 4. Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    // 5. Generar Token JWT
    const token = jwt.sign(
        { id: nuevoUsuario._id, rol: nuevoUsuario.rol }, // Incluimos el ID y el rol en el token
        process.env.JWT_SECRET, // Secreto definido en tu .env
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Expiración del token (configurable)
    );

    // 6. Responder con el usuario creado y el token
    res.status(201).json({
        status: 'success', // Consistencia con otras respuestas
        message: 'Usuario registrado exitosamente',
        data: {
            usuario: { // Usamos 'usuario' en la respuesta
                id: nuevoUsuario._id,
                nombreUsuario: nuevoUsuario.nombreUsuario,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol // Incluimos el rol en la respuesta
            },
            token // Envía el token al cliente
        }
    });
});

/**
 * @desc    Autenticar usuario y obtener token
 * @route   POST /api/auth/login
 * @access  Public
 */
const iniciarSesionUsuario = catchAsync(async (req, res, next) => {
    const { email, contrasena } = req.body; // Obtiene email y contraseña del cuerpo

    // 1. Validar la entrada (campos requeridos)
    if (!email || !contrasena) {
        return next(new AppError('Por favor, proporciona correo electrónico y contraseña.', 400));
    }

    // 2. Verificar si el usuario existe por correo electrónico
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        // Usamos el mismo mensaje para email/contraseña inválidos para no dar pistas a atacantes.
        return next(new AppError('Credenciales inválidas.', 400));
    }

    // 3. Comparar la contraseña ingresada con la contraseña hasheada en la BD
    const esCoincidente = await usuario.compararContrasena(contrasena); // Usa el método que definimos en el modelo Usuario
    if (!esCoincidente) {
        return next(new AppError('Credenciales inválidas.', 400));
    }

    // 4. Actualizar la última fecha de login (opcional)
    usuario.ultimoInicioSesion = Date.now();
    await usuario.save({ validateBeforeSave: false }); // 'validateBeforeSave: false' para evitar re-validaciones innecesarias en un simple update.

    // 5. Generar Token JWT
    const token = jwt.sign(
        { id: usuario._id, rol: usuario.rol }, // Incluimos el ID y el rol en el token
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 6. Responder con el usuario y el token
    res.status(200).json({
        status: 'success', // Consistencia con otras respuestas
        message: 'Inicio de sesión exitoso',
        data: {
            usuario: { // Usamos 'usuario' en la respuesta
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                rol: usuario.rol // Incluimos el rol en la respuesta
            },
            token
        }
    });
});

module.exports = {
    registrarUsuario,
    iniciarSesionUsuario
};