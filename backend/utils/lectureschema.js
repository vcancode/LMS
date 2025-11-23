import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  length: {
    type: String,    
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  }
});

const Lecture = mongoose.model("Lecture", LectureSchema);

export default Lecture;
