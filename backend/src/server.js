import express from "express"
import { connectDB } from "./libs/db.js";
const app = express();

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})