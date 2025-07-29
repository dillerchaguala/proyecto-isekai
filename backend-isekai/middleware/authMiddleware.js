// backend-isekai/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User'); // Necesitamos el modelo de usuario

// Importamos nuestras utilidades para un manejo de errores consistente
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync'); // Asumiendo que ya tienes esta utilidad

/**
 * @desc    Middleware para proteger rutas, verificando la autenticación del usuario.
 * @param   {Object} req - Objeto de solicitud de Express
 * @param   {Object} res - Objeto de respuesta de Express
 * @param   {Function} next - Función para pasar al siguiente middleware
 */
const protegerRuta = catchAsync(async (req, res, next) => {
    let token;

    // 1. Verificar si el token existe en los headers de la petición y tiene el formato 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Obtener el token de los headers (quitar 'Bearer ')
        token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token en el formato esperado, lanzar un error
    if (!token) {
        return next(new AppError('No autorizado, no hay token.', 401));
    }

    try {
        // 2. Verificar el token
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Adjuntar el usuario a la petición (req.usuario)
        // Busca el usuario por el ID que está en el payload del token, excluyendo la contraseña
        req.usuario = await Usuario.findById(decodificado.id).select('-contrasena');

        // Si el usuario no se encuentra (ej. fue eliminado después de generar el token)
        if (!req.usuario) {
            return next(new AppError('No autorizado, el usuario asociado al token no existe.', 401));
        }

        next(); // Permite que la petición continúe al siguiente middleware/controlador

    } catch (error) {
        // Mostrar el error real de JWT en consola para depuración
        console.log('JWT ERROR:', error);
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('No autorizado, token inválido.', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('No autorizado, token expirado.', 401));
        }
        // Para cualquier otro error inesperado durante la verificación
        return next(new AppError('No autorizado, error de autenticación.', 401));
    }
});

/**
 * @desc    Middleware para autorizar el acceso basado en el rol del usuario.
 * @param   {Array<String>} roles - Array de roles permitidos (ej. ['administrador', 'terapeuta'])
 * @returns {Function} - Middleware Express
 */
const autorizarRol = (roles) => {
    return (req, res, next) => {
        // req.usuario.rol viene del middleware protegerRuta.
        // Si protegerRuta falló, este middleware no debería ejecutarse.
        // Sin embargo, es buena práctica tener una verificación aquí.
        if (!req.usuario || !req.usuario.rol) {
            // Este caso es poco probable si `protegerRuta` funciona correctamente,
            // pero asegura que si `req.usuario` no está disponible, se maneje.
            return next(new AppError('No autenticado. Rol de usuario no disponible.', 401));
        }

        // Verificar si el rol del usuario autenticado está incluido en los roles permitidos
        if (!roles.includes(req.usuario.rol)) {
            // Si el rol del usuario no está en la lista de roles permitidos, denegar acceso.
            return next(new AppError('Acceso denegado. No tienes permiso para realizar esta acción.', 403));
        }

        next(); // Si el rol es permitido, pasa al siguiente middleware/controlador
    };
};

// --- Exportar ambas funciones ---
module.exports = {
    protegerRuta,
    autorizarRol,
};