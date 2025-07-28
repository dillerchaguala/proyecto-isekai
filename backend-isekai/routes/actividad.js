// backend-isekai/routes/actividad.js (o actividadRoutes.js, el nombre que elijas para el archivo)
const express = require('express');
const router = express.Router();
const {
    crearActividad,
    obtenerActividades,
    obtenerActividadPorId,
    actualizarActividad,
    eliminarActividad
} = require('../controllers/actividadController');

// Asegúrate de que la ruta a tu middleware de autenticación sea correcta.
// Y UTILIZA 'protegerRuta' y 'autorizarRol' para consistencia con tus otras rutas.
const { protegerRuta, autorizarRol } = require('../middleware/authMiddleware'); // <--- CAMBIO CLAVE AQUÍ

// Las rutas DEBEN coincidir con el endpoint definido en el frontend: '/api/actividades'
// Para lograr esto, asegurate que en tu 'app.js' o 'server.js' uses:
// app.use('/api/actividades', actividadRoutes);

// Ruta para crear y obtener todas las actividades
router.route('/')
    // @desc    Crear una nueva actividad
    // @route   POST /api/actividades
    // @access  Private (Admin/Terapeuta)
    .post(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crearActividad) // <--- CAMBIO AQUÍ
    // @desc    Obtener todas las actividades
    // @route   GET /api/actividades
    // @access  Public (solo activas), Private (Admin/Terapeuta para todas)
    .get(obtenerActividades); // La lógica de rol/activa está en el controlador

// Rutas para operaciones con una actividad específica por ID
router.route('/:id')
    // @desc    Obtener una actividad por ID
    // @route   GET /api/actividades/:id
    // @access  Public (si está activa), Private (Admin/Terapeuta para cualquier estado)
    .get(obtenerActividadPorId) // La lógica de rol/activa está en el controlador

    // @desc    Actualizar una actividad
    // @route   PUT /api/actividades/:id (o PATCH si tu controlador usa PATCH)
    // @access  Private (Admin/Terapeuta)
    .put(protegerRuta, autorizarRol(['administrador', 'terapeuta']), actualizarActividad) // <--- CAMBIO AQUÍ

    // @desc    Eliminar una actividad
    // @route   DELETE /api/actividades/:id
    // @access  Private (Solo Admin, por seguridad)
    .delete(protegerRuta, autorizarRol(['administrador']), eliminarActividad); // <--- CAMBIO AQUÍ (Sugiero solo Admin para eliminar)

module.exports = router;