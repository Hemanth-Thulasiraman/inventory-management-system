const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/stats', orderController.getStats);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.post('/:id/confirm', orderController.confirm);
router.post('/:id/cancel', orderController.cancel);
router.delete('/:id', orderController.delete);

module.exports = router;
