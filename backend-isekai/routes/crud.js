// backend-isekai/routes/crud.js
const express =require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const { protegerRuta, autorizarRol } = require('../middleware/authMiddleware');
// Protección: si no se especifica el recurso, devolver error 400
router.all('/', (req, res) => {
  res.status(400).json({ status: 'fail', message: 'Debes especificar un recurso en la URL, por ejemplo /api/crud/logros' });
});

// Todas las rutas CRUD genéricas protegidas y solo para admin/terapeuta
router
  .route('/:resource')
  .get(protegerRuta, crudController.getAll)
  .post(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crudController.create);

router
  .route('/:resource/:id')
  .get(protegerRuta, crudController.getOne)
  .put(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crudController.update)
  .delete(protegerRuta, autorizarRol(['administrador', 'terapeuta']), crudController.delete);

module.exports = router;
