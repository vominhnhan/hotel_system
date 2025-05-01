import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRouter from "./routes/customer.route.js";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use("/api/customer", customerRouter);

app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});
