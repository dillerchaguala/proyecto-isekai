// routes/terapias.js
const express = require('express');
const {
    crearTerapia,
    obtenerTerapias,
    obtenerTerapiaPorId,
    actualizarTerapia,
    eliminarTerapia
} = require('../controllers/terapiaController'); // Importa las funciones del controlador de terapias

const { protegerRuta } = require('../middleware/authMiddleware'); // Importa el middleware de protección

const router = express.Router();

// Rutas para /api/terapias

// POST /api/terapias - Crear una nueva terapia (Solo Admin/Terapeuta y autenticado)
// GET /api/terapias - Obtener todas las terapias (Público si activas, Admin/Terapeuta todas)
router.route('/')
    .post(protegerRuta, crearTerapia) // Protegida: requiere autenticación y rol
    .get(obtenerTerapias); // No protegida por protect middleware aquí, la lógica de rol está en el controlador

// Rutas para /api/terapias/:id

// GET /api/terapias/:id - Obtener una terapia específica por ID (Público si activa, Admin/Terapeuta cualquier estado)
// PUT /api/terapias/:id - Actualizar una terapia (Solo Admin/Terapeuta y autenticado)
// DELETE /api/terapias/:id - Eliminar una terapia (Solo Admin/Terapeuta y autenticado)
router.route('/:id')
    .get(obtenerTerapiaPorId) // No protegida por protect middleware aquí, la lógica de rol está en el controlador
    .put(protegerRuta, actualizarTerapia) // Protegida
    .delete(protegerRuta, eliminarTerapia); // Protegida

module.exports = router;