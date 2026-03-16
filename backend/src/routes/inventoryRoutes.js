const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/below-threshold', inventoryController.getBelowThreshold);
router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.delete);

module.exports = router;
