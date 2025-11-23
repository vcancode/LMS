// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }

  // Optional: Event listeners for debug/logging
  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔁 MongoDB Reconnected");
  });
};

export default connectDB;
