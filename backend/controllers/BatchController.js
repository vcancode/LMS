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
    const BatchCreator= await User.findOne({email:PublishedBy})
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
      PublishedBy:BatchCreator.firstName
    });

    const savedBatch = await newBatch.save();

    // Convert batch to plain JS so embedding works properly
    const batchToEmbed = await savedBatch.toObject();

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

const GetBatch=async(req,res)=>{
  try {
    console.log("inside batch router");
    const id = req.params.id;
    const batch=await Batch.findById(id);
    console.log(batch);
    if(!batch){
      res.status(404).json({message:'batch not found'})
    }

    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({message:"server error",error:error.message})
  }

}

const updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const {
      name,
      description,
      domain,
      thumbnail,
      price,
      isPublished,
      PublishedBy,
      newVideos
    } = req.body;

    // 1. Fetch existing batch
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // 2. Save new lectures in Lecture collection
    const savedLectures = [];
    for (const v of newVideos) {
      const lectureDoc = new Lecture({
        name: v.title,
        link: v.videoUrl,
        length: String(v.duration),
        isFree: v.isFree ?? false,
      });

      const savedLecture = await lectureDoc.save();
      savedLectures.push(savedLecture);
    }

    // 3. Push saved lectures into batch
    batch.lectures.push(...savedLectures);

    // update batch metadata
    batch.name = name;
    batch.description = description;
    batch.domain = domain;
    batch.thumbnail = thumbnail;
    batch.price = price;
    batch.isPublic = isPublished;

    const updatedBatch = await batch.save();

    // 4. Replace ONLY the specific batch inside the user's Batches array using arrayFilters
    const UsersWithBatch= await User.find({"Batches._id":batchId})

    for (const user of UsersWithBatch) {
  
  user.Batches = user.Batches.map(batch =>
    String(batch._id) === String(batchId)
      ? updatedBatch.toObject()    // replace this batch
      : batch                      // keep others same
  );
  await user.save();  // save updated user
}

    return res.status(200).json({
      message: "Batch updated successfully",
      batch: updatedBatch,
    });

  } catch (error) {
    console.error("UPDATE BATCH ERROR:", error.message);
    return res.status(500).json({
      message: "Server error while updating batch",
      error: error.message,
    });
  }
};


export { CreateBatch,GetBatch,updateBatch };
