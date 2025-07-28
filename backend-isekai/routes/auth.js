// routes/auth.js
const express = require('express');
const { registrarUsuario, iniciarSesionUsuario } = require('../controllers/authController'); 

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesionUsuario);

module.exports = router;