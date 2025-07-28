const express = require('express');
const router = express.Router();
const {
    crearDesafio,
    obtenerDesafios,
    obtenerDesafioPorId, // <-- Añadido
    actualizarDesafio,   // <-- Añadido
    eliminarDesafio      // <-- Añadido
} = require('../controllers/desafioController');

const { protegerRuta, autorizarRol } = require('../middleware/authMiddleware');

// Las rutas DEBEN coincidir con el endpoint definido en el frontend: '/api/desafiosDiarios'
// Para lograr esto, asegurate que en tu 'app.js' o 'server.js' uses:
// app.use('/api/desafiosDiarios', desafioRoutes);
// Si tu archivo de rutas se llama 'desafio.js', renombralo a 'desafioDiarioRoutes.js' para mayor claridad.

// Rutas para /api/desafiosDiarios

// @desc    Crear un nuevo desafío
// @route   POST /api/desafiosDiarios
// @access  Private (Admin/Terapeuta)
router.route('/')
    .post(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crearDesafio)
    // @desc    Obtener todos los desafíos (para el CrudManager, un admin/terapeuta necesita ver todos)
    // @route   GET /api/desafiosDiarios
    // @access  Private (Admin/Terapeuta para ver todos, Paciente para ver solo activos)
    .get(protegerRuta, obtenerDesafios); // La lógica de filtro por rol ya está en el controlador

// Rutas para /api/desafiosDiarios/:id

// @desc    Obtener un desafío específico por ID
// @route   GET /api/desafiosDiarios/:id
// @access  Private (Todos los roles autenticados)
// @desc    Actualizar un desafío
// @route   PUT /api/desafiosDiarios/:id
// @access  Private (Admin/Terapeuta)
// @desc    Eliminar un desafío
// @route   DELETE /api/desafiosDiarios/:id
// @access  Private (Admin/Terapeuta)
router.route('/:id')
    .get(protegerRuta, obtenerDesafioPorId) // Puedes añadir autorizarRol si solo admins/terapeutas ven inactivos por ID
    .put(protegerRuta, autorizarRol(['administrador', 'terapeuta']), actualizarDesafio)
    .delete(protegerRuta, autorizarRol(['administrador', 'terapeuta']), eliminarDesafio);

module.exports = router;