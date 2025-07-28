// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User'); // Necesitamos el modelo de usuario

const protegerRuta = async (req, res, next) => {
    let token;

    // 1. Verificar si el token existe en los headers de la petición
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token de los headers (quitar 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Adjuntar el usuario a la petición (req.usuario)
            // Busca el usuario por el ID que está en el payload del token, excluyendo la contraseña
            req.usuario = await Usuario.findById(decodificado.id).select('-contrasena');

            // Si el usuario no se encuentra (ej. fue eliminado después de generar el token)
            if (!req.usuario) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            next(); // Permite que la petición continúe a la siguiente función (la ruta)

        } catch (error) {
            console.error(error);
            // Si el token no es válido o ha expirado
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    } else { // Si no hay token en los headers, o no tiene el formato 'Bearer'
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

const autorizarRol = (roles) => {
    return (req, res, next) => {
        // req.usuario.rol viene del middleware protegerRuta
        // Si protegerRuta ya falló, este middleware no se ejecutará,
        // pero es una buena práctica añadir una verificación aquí también.
        if (!req.usuario || !req.usuario.rol) {
            return res.status(401).json({ message: 'No autenticado. Rol de usuario no disponible.' });
        }

        // Verificar si el rol del usuario está incluido en los roles permitidos
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para realizar esta acción.' });
        }

        next(); // Si el rol es permitido, pasa al siguiente middleware/controlador
    };
};

// --- EXPORTAR AMBAS FUNCIONES ---
module.exports = {
    protegerRuta,
    autorizarRol, // ¡Ahora está exportada!
};