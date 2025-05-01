import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeeRouter from "./routes/employee.route.js";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/employees", employeeRouter);

app.listen(PORT, () => {
  console.log(`Employee Service running on port ${PORT}`);
});
