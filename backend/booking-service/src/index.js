import dotenv from 'dotenv';
import express from 'express';
import bookingRoutes from './routes/bookingRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Booking Service is running on port ${PORT}`);
});