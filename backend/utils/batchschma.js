import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  thumbnail: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  domain:{
    type:String,
    required:true
  },
  lectures: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Lecture",
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  PublishedBy:{
    type:String,
    required:true
  }
});

const Batch = mongoose.model("Batch", BatchSchema);

export default Batch;
