const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/', tenantController.getAll);
router.get('/:id', tenantController.getById);
router.post('/', tenantController.create);
router.put('/:id', tenantController.update);
router.delete('/:id', tenantController.delete);

module.exports = router;
