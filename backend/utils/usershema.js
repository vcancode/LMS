import mongoose from "mongoose";
import Batch from "./batchschma.js";   // import full Batch model

// Use Batch.schema to embed the whole schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["student", "teacher"],
    required:true
  },

  Batches: {
    type: [Batch.schema],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
