import Batch from "../utils/batchschma.js"
import Lecture from "../utils/lectureschema.js"
import User from "../utils/usershema.js";

const CreateBatch = async (req, res) => {
  try {
    const {
      name,
      description,
      thumbnail,
      price,
      domain,
      isPublished,
      videos,
      PublishedBy
    } = req.body;

    // Validation
    if (!name || !description || !domain || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!videos || videos.length === 0) {
      return res.status(400).json({ error: "At least one video is required" });
    }

    // 1. Convert videos[] → Lecture documents
    const lectureIds = [];

    for (const vid of videos) {
      const newLecture = new Lecture({
        name: vid.title,
        length: vid.duration?.toString() || "0",
        link: vid.videoUrl,
        isFree: vid.isFree
      });

      const savedLecture = await newLecture.save();
      lectureIds.push(savedLecture);
    }

    // 2. Create batch document
    const newBatch = new Batch({
      name,
      description,
      thumbnail,
      price,
      domain,
      lectures: lectureIds,
      isPublic: isPublished,
      PublishedBy
    });

    const savedBatch = await newBatch.save();

    // Convert batch to plain JS so embedding works properly
    const batchToEmbed = savedBatch.toObject();

    // 3. Push FULL batch object to user's Batches[]
    const updatedUser = await User.findOneAndUpdate(
      { email: PublishedBy },
      { $push: { Batches: batchToEmbed } },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({
      message: "Batch created successfully",
      batch: savedBatch,
      user: updatedUser
    });

  } catch (err) {
    console.error("Error creating batch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { CreateBatch };
