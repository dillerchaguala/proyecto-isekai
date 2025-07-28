// controllers/authController.js
const Usuario = require('../models/User'); // Importa el modelo de usuario (usando el nombre de archivo)
const jwt = require('jsonwebtoken');   // Para crear JSON Web Tokens

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registrarUsuario = async (req, res) => {
    const { nombreUsuario, email, contrasena, rol } = req.body; // Obtiene los datos del cuerpo de la petición
    console.log("DEBUG Backend Registro: Datos recibidos:", { nombreUsuario, email, contrasena });
    try {
        // 1. Verificar si el usuario ya existe por correo electrónico o nombre de usuario
        let usuarioExistente = await Usuario.findOne({ email});
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario con este correo electrónico ya existe' });
        }

        usuarioExistente = await Usuario.findOne({ nombreUsuario });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // 2. Crear un nuevo usuario
        const nuevoUsuario = new Usuario({
            nombreUsuario,
            email,
            contrasena, // Mongoose Pre-save middleware se encargará de hashear la contraseña
            rol // Si se envía un rol, lo usa; de lo contrario, usa el valor por defecto 'paciente'
        });

        // 3. Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        // 4. Generar Token JWT
        const token = jwt.sign(
            { id: nuevoUsuario._id, rol: nuevoUsuario.rol }, // Incluimos el rol en el token
            process.env.JWT_SECRET, // Secreto definido en tu .env
            { expiresIn: '1h' } // El token expirará en 1 hora
        );

        // 5. Responder con el usuario creado y el token
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: { // Usamos 'usuario' en la respuesta en lugar de 'user'
                id: nuevoUsuario._id,
                nombreUsuario: nuevoUsuario.nombreUsuario,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol // Incluimos el rol en la respuesta
            },
            token // Envía el token al cliente
        });

    } catch (error) {
        console.error(error.message); // Log del error en la consola del servidor
        res.status(500).json({ message: 'Error del servidor al registrar usuario' });
    }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const iniciarSesionUsuario = async (req, res) => {
    const { email, contrasena } = req.body; // Obtiene email y contraseña del cuerpo

    try {
        // 1. Verificar si el usuario existe por correo electrónico
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña ingresada con la contraseña hasheada en la BD
        const esCoincidente = await usuario.compararContrasena(contrasena); // Usa el método que definimos en el modelo
        if (!esCoincidente) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 3. Actualizar la última fecha de login (opcional)
        usuario.ultimoInicioSesion = Date.now();
        await usuario.save(); // Guarda el cambio

        // 4. Generar Token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol }, // Incluimos el rol en el token
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Responder con el usuario y el token
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: { // Usamos 'usuario' en la respuesta en lugar de 'user'
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                rol: usuario.rol // Incluimos el rol en la respuesta
            },
            token
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error del servidor al iniciar sesión' });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesionUsuario
};