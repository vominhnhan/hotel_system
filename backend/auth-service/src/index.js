import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
