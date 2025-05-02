import dotenv from 'dotenv';
import express from 'express';
import roomRoutes from './routes/roomRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/rooms', roomRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Room Management Service is running on port ${PORT}`);
});