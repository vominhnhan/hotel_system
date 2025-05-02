import express from 'express';
import reportController from '../controllers/reportController.js';

const router = express.Router();

router.get('/generate', reportController.generateReport);

export default router;