// backend-isekai/middleware/errorMiddleware.js
const AppError = require('../utils/appError'); // Asegúrate de que esta ruta sea correcta

const errorConverter = (err, req, res, next) => {
    let error = err;

    // Si el error no es una instancia de AppError, lo convertimos.
    // Esto es útil para errores de Mongoose, errores de programación, etc.
    if (!(error instanceof AppError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Error interno del servidor';
        // Asumimos que los errores no AppError son operacionales si tienen un statusCode,
        // de lo contrario, son errores de programación y no expondremos detalles en prod.
        const isOperational = error.isOperational !== undefined ? error.isOperational : (statusCode >= 400 && statusCode < 500);
        error = new AppError(message, statusCode, isOperational);
    }
    next(error); // Pasa el error (ahora una instancia de AppError) al siguiente middleware
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // En producción, no envíes detalles sensibles del error de programación
    // Solo errores operacionales (AppError) o errores 4xx deben mostrar un mensaje específico.
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Error interno del servidor';
    }

    res.status(statusCode).json({
        status: 'error',
        message: message,
        // Muestra el stack trace solo en entorno de desarrollo para depuración
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = {
    errorConverter,
    errorHandler,
};