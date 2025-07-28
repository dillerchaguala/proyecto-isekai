// routes/estadoAnimo.js
const express = require('express');
const router = express.Router();
const { registrarEstadoAnimo, obtenerHistorialEstadoAnimo } = require('../controllers/estadoAnimoController');
const { protegerRuta } = require('../middleware/authMiddleware'); // Necesitamos proteger esta ruta

// Ruta para registrar un nuevo estado de ánimo
router.post('/', protegerRuta, registrarEstadoAnimo);

// Ruta para obtener el historial de estados de ánimo del usuario
router.get('/', protegerRuta, obtenerHistorialEstadoAnimo);

module.exports = router;