import dotenv from 'dotenv';
import express from 'express';
import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/reports', reportRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Report Service is running on port ${PORT}`);
});