// routes/terapias.js
const express = require('express');
const {
    crearTerapia,
    obtenerTerapias,
    obtenerTerapiaPorId,
    actualizarTerapia,
    eliminarTerapia
} = require('../controllers/terapiaController');

// Asegúrate de importar autorizarRol
const { protegerRuta, autorizarRol } = require('../middleware/authMiddleware'); // <--- CAMBIO AQUÍ

const router = express.Router();

router.route('/')
    // Aplica autorizarRol directamente en la ruta para mayor claridad
    .post(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crearTerapia) // <--- CAMBIO AQUÍ
    .get(obtenerTerapias);

router.route('/:id')
    .get(obtenerTerapiaPorId)
    // Aplica autorizarRol directamente en la ruta para mayor claridad
    .put(protegerRuta, autorizarRol(['administrador', 'terapeuta']), actualizarTerapia) // <--- CAMBIO AQUÍ
    .delete(protegerRuta, autorizarRol(['administrador', 'terapeuta']), eliminarTerapia); // O solo ['administrador'] si solo admins pueden eliminar

module.exports = router;