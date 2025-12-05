import express from "express"
import cors from "cors"
import { connectDB } from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cookieParser from 'cookie-parser';

const app = express();

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

// Middleware
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/lists', listRoutes);

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})