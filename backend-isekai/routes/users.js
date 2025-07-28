// routes/users.js
// routes/users.js
const express = require('express');
const { protegerRuta } = require('../middleware/authMiddleware'); 


const {
    PerfilUsuario, 
    TareaCompletada, 
} = require('../controllers/userController'); 

const router = express.Router();

// @desc    Obtener el perfil del usuario autenticado
// @route   GET /api/users/profile
// @access  Private (requiere autenticación)
router.get('/profile', protegerRuta, PerfilUsuario); 


// @route   POST /api/users/complete-therapy
// @desc    Permite a un paciente marcar una terapia como completada
// @access  Private (solo para usuarios autenticados, el controlador verifica el rol 'paciente')
router.post('/complete-therapy', protegerRuta, TareaCompletada); 

module.exports = router;