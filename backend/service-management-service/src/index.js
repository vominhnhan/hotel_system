import dotenv from 'dotenv';
import express from 'express';
import serviceRoutes from './routes/serviceRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/services', serviceRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Management Service is running on port ${PORT}`);
});