import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./utils/db.js";
import userrouter from "./routes/userroutes.js";
import BatchRouter from "./routes/BatchRoutes.js";


dotenv.config();

const app = express();

// ✅ Middleware setup
app.use(cors());

// Body Parser Configuration
app.use(bodyParser.json({ limit: "10mb" })); // Parse JSON requests up to 10MB
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" })); // Handle form submissions
app.use(express.json());
connectDB()
app.use(userrouter)
app.use(BatchRouter)


// allow cross-origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
