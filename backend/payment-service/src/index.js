// payment-service/index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import paymentRoutes from './routes//payment.route.js'; // Đổi từ expenseRoutes thành paymentRoutes
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Phân tích dữ liệu từ form
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // Phục vụ tệp tĩnh từ thư mục uploads
app.use('/api/payment', paymentRoutes); // Đổi prefix thành /api/payment
app.use(errorHandler);

const PORT = process.env.PORT || 3006; // Đổi cổng mặc định thành 3006 để tránh xung đột
app.listen(PORT, () => {
  console.log(`Payment Service is running on port ${PORT}`); // Đổi thông báo thành Payment Service
});