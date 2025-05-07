import express from 'express';
import roomRouter from './routes/roomRoutes.js';
import roomTypeRouter from './routes/roomTypeRouter.js';
import prisma from './common/prisma/init.prisma.js';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());
app.use('/api/rooms', roomRouter);
app.use('/api/room-types', roomTypeRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Room Microservice is running on port ${PORT}`);
});