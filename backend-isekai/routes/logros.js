// backend-isekai/routes/logros.js
const express = require('express');
// Asegúrate de que las rutas a tus middlewares son correctas
const { protegerRuta, autorizarRol } = require('../middleware/authMiddleware'); 
const { 
    crearLogro, 
    obtenerTodosLosLogros,
    obtenerLogroPorId, 
    actualizarLogro,
    eliminarLogro      
} = require('../controllers/logroController'); 

const router = express.Router();

// Ruta para crear un nuevo logro
// @desc    Crear un nuevo logro
// @route   POST /api/logros
// @access  Private (Admin/Terapeuta)
router.post('/', protegerRuta, autorizarRol(['administrador', 'terapeuta']), crearLogro);

// Ruta para obtener todos los logros
// @desc    Obtener todos los logros
// @route   GET /api/logros
// @access  Public (puedes añadir protección si lo necesitas)
router.get('/', obtenerTodosLosLogros); 

// Rutas para operaciones por ID (Obtener, Actualizar, Eliminar)
router
    .route('/:id')
    // @desc    Obtener un logro por ID
    // @route   GET /api/logros/:id
    // @access  Public (o privado si decides protegerlo)
    .get(obtenerLogroPorId) 
    // @desc    Actualizar un logro por ID
    // @route   PATCH /api/logros/:id // <--- Cambiado de PUT a PATCH para consistencia con el controlador
    // @access  Private (Admin/Terapeuta)
    .patch(protegerRuta, autorizarRol(['administrador', 'terapeuta']), actualizarLogro)
    // @desc    Eliminar un logro por ID
    // @route   DELETE /api/logros/:id
    // @access  Private (Solo Admin)
    .delete(protegerRuta, autorizarRol(['administrador']), eliminarLogro); // Generalmente, eliminar es solo para admins

module.exports = router;