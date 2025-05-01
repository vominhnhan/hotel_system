const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const validateService = require('../middlewares/validateService');

router.post('/', validateService, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', validateService, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;