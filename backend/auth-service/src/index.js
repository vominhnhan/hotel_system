import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
