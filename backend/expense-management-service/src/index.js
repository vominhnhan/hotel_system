import dotenv from 'dotenv';
import express from 'express';
import expenseRoutes from './routes/expense.route.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from "cors";
import path from 'path';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Phân tích dữ liệu từ form
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // Phục vụ tệp tĩnh từ thư mục uploads
app.use('/api/expense', expenseRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Expense Management Service is running on port ${PORT}`);
});