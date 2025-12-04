import express from "express"
import cors from "cors"
import { connectDB } from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

const app = express();

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})