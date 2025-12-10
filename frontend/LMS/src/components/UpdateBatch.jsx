// UpdateBatch.jsx
import React, { useState, useEffect } from "react";
import Axios from "axios";
import useUserStore from "../store/zustandstore";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import { useNavigate, useParams } from "react-router";

const UpdateBatch = () => {
  const { batchId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("batch");
  const CurrentUser = useUserStore((state) => state.user);
  const [uploadQueue, setUploadqueue] = useState([]);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const sectionVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Main batch form data
  const [batchData, setBatchData] = useState({
    name: "",
    description: "",
    domain: "",
    thumbnail: "",
    price: "",
    isPublished: false,
    PublishedBy: "",
  });

  // New videos array (only new uploads)
  const [newVideos, setNewVideos] = useState([]);

  // Domain options
  const domainOptions = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  // Fetch batch details on component mount
  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoadingBatch(true);
        const token = localStorage.getItem("token");
        
        // Fetch batch details
        const batchRes = await fetch(
          `${import.meta.env.VITE_BASEURL}/getbatch/${batchId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!batchRes.ok) {
          throw new Error("Failed to fetch batch details");
        }
        
        const batchData = await batchRes.json();
        
        // Update state with fetched data
        setBatchData({
          name: batchData.name || "",
          description: batchData.description || "",
          domain: batchData.domain || "",
          thumbnail: batchData.thumbnail || "",
          price: batchData.price || "",
          isPublished: batchData.isPublished || false,
          PublishedBy: batchData.PublishedBy || "",
        });
        
        setLoadingBatch(false);
        
      } catch (error) {
        console.error("Error fetching batch:", error);
        alert("Failed to load batch details");
        navigate("/teacherdashboard/main");
      } finally {
        setLoadingBatch(false);
      }
    };
    
    fetchBatchDetails();
  }, [batchId, navigate]);

  // Handle batch form input changes
  const handleBatchInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBatchData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    setThumbnailLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "VINEET");
      formdata.append("cloud_name", "dvwmxedd9");

      const res = await Axios.post(
        "https://api.cloudinary.com/v1_1/dvwmxedd9/image/upload",
        formdata
      );
      setBatchData((prev) => ({ ...prev, thumbnail: res.data.secure_url }));
      setThumbnailLoading(false);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setThumbnailLoading(false);
    }
  };

  // Cloudinary uploader function for new videos
  const CloudinaryUploader = async (file, id, title, isFree = false) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "VINEET");
    formdata.append("cloud_name", "dvwmxedd9");
    formdata.append("resource_type", "video");

    try {
      const res = await Axios.post(
        "https://api.cloudinary.com/v1_1/dvwmxedd9/video/upload",
        formdata,
        {
          onUploadProgress: (ProgressEvent) => {
            const percentage = Math.round(
              (ProgressEvent.loaded * 100) / ProgressEvent.total
            );

            setUploadqueue((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, progress: percentage, status: "uploading" }
                  : item
              )
            );
          },
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url = res.data.secure_url;
      const duration = res.data.duration;

      // Update upload queue
      setUploadqueue((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                progress: 100,
                status: "done",
                videoUrl: url,
                duration,
              }
            : item
        )
      );

      // Add to new videos array
      const newVideo = {
        id: crypto.randomUUID(),
        title: title,
        description: "",
        videoUrl: url,
        isFree: isFree,
        duration: duration,
        order: newVideos.length + 1,
      };

      setNewVideos((prev) => [...prev, newVideo]);

      return { url, duration };
    } catch (error) {
      console.error(error);
      setUploadqueue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "error" } : item
        )
      );
    }
  };

  // Handle multiple video file upload
  const handleVideoFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create upload queue entries
    const newQueueItems = files.map((file) => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      file,
      progress: 0,
      status: "idle",
      videoUrl: "",
      duration: 0,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      isFree: false,
    }));

    setUploadqueue((prev) => [...prev, ...newQueueItems]);

    // Start uploads
    newQueueItems.forEach(async (queueItem) => {
      try {
        await CloudinaryUploader(
          queueItem.file, 
          queueItem.id, 
          queueItem.title, 
          queueItem.isFree
        );
      } catch (err) {
        console.log("Upload error:", err);
      }
    });
  };

  // Handle new video title/description change
  const handleVideoChange = (videoId, field, value) => {
    setNewVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, [field]: value } : video
      )
    );
  };

  // Remove new video from list
  const removeNewVideo = (videoId) => {
    setNewVideos((prev) => prev.filter((video) => video.id !== videoId));
  };

  // Toggle free status for a new video
  const toggleVideoFreeStatus = (videoId) => {
    setNewVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, isFree: !video.isFree } : video
      )
    );
  };

  // Remove from upload queue (cancel upload)
  const removeFromQueue = (queueId) => {
    setUploadqueue((prev) => prev.filter((item) => item.id !== queueId));
  };

  // Prepare videos data for submission (only new videos)
  const prepareNewVideosData = () => {
    return newVideos.map(video => ({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      isFree: video.isFree,
      duration: video.duration,
      order: video.order,
    }));
  };

  // Update batch with only new videos
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!batchData.name || !batchData.domain) {
      alert("Please fill all required fields");
      return;
    }

    if (!batchData.description) {
      alert("Please add a batch description");
      return;
    }

    if (!batchData.thumbnail) {
      alert("Please upload a thumbnail image");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again");
        navigate("/login");
        return;
      }

      const finalBatchData = {
        // Batch metadata
        name: batchData.name,
        description: batchData.description,
        domain: batchData.domain,
        thumbnail: batchData.thumbnail,
        price: batchData.price,
        isPublished: batchData.isPublished,
        PublishedBy: CurrentUser.email,
        
        // New videos to add
        newVideos: prepareNewVideosData(),
        
        // Statistics for new videos
        totalNewVideos: newVideos.length,
        newFreeVideos: newVideos.filter((video) => video.isFree).length,
      };

      console.log("Updating batch with new videos:", finalBatchData);

      const res = await fetch(`${import.meta.env.VITE_BASEURL}/batchupdate/${batchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalBatchData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to update batch");
      }

      alert("Batch updated successfully!");
      navigate("/teacherdashboard/main");

    } catch (err) {
      console.error("Error updating batch:", err);
      alert(err.message || "Error updating batch. Please try again.");
    }
    setIsLoading(false);
  };

  // Loading state
  if (loadingBatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg text-gray-700">Loading batch details...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Use Header Component */}
      <Header
        title="Update Batch"
        userName={CurrentUser?.firstName || "Educator"}
        userImage={CurrentUser?.imageUrl || "/default-avatar.png"}
      />

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Update Batch
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Update batch details and add new videos to your course
            </motion.p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Batch ID: {batchId}
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-sm border">
              <motion.button
                onClick={() => setActiveSection("batch")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeSection === "batch"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium">Batch Details</span>
              </motion.button>
              <div className="w-8 h-px bg-gray-300"></div>
              <motion.button
                onClick={() => setActiveSection("videos")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeSection === "videos"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Add Videos</span>
              </motion.button>
            </div>
          </motion.div>

          <form onSubmit={handleUpdate}>
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                {/* Batch Information Section */}
                {activeSection === "batch" && (
                  <motion.div
                    key="batch"
                    className="p-8"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <motion.div
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Batch Information
                        </h2>
                        <p className="text-gray-600">
                          Update basic details about your course batch
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Batch Name */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Batch Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={batchData.name}
                            onChange={handleBatchInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., Advanced React Masterclass 2024"
                            required
                          />
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={batchData.description}
                            onChange={handleBatchInputChange}
                            rows="5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Describe what students will learn, prerequisites, and key takeaways..."
                            required
                          />
                        </motion.div>

                        {/* Price */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Price (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                              ₹
                            </span>
                            <input
                              type="number"
                              name="price"
                              value={batchData.price}
                              onChange={handleBatchInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Enter price in INR"
                              min="0"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Domain */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Domain <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="domain"
                            value={batchData.domain}
                            onChange={handleBatchInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                            required
                          >
                            <option value="" className="text-gray-500">
                              Select a domain
                            </option>
                            {domainOptions.map((domain, index) => (
                              <option
                                key={index}
                                value={domain}
                                className="py-2"
                              >
                                {domain}
                              </option>
                            ))}
                          </select>
                        </motion.div>

                        {/* Thumbnail Upload */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Thumbnail <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-4">
                            <input
                              className="hidden disabled:cursor-not-allowed"
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              id="thumbnailUpload"
                              disabled={thumbnailLoading}
                            />
                            <motion.label
                              htmlFor="thumbnailUpload"
                              className="flex items-center justify-center space-x-2 w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg
                                className="w-8 h-8 text-gray-400 group-hover:text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <div>
                                <p className="text-gray-600 group-hover:text-blue-600 font-medium">
                                  {thumbnailLoading
                                    ? "Uploading..."
                                    : batchData.thumbnail ? "Change thumbnail" : "Click to upload thumbnail"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG, WEBP up to 10MB
                                </p>
                              </div>
                            </motion.label>

                            {batchData.thumbnail && (
                              <motion.div
                                className="relative group flex justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <img
                                  src={batchData.thumbnail}
                                  alt="Thumbnail preview"
                                  className="w-[80%] h-48 object-fill rounded-xl shadow-md"
                                />
                                <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all rounded-xl flex items-center justify-center">
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      setBatchData((prev) => ({
                                        ...prev,
                                        thumbnail: "",
                                      }))
                                    }
                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-90 group-hover:scale-100"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>

                        {/* Publish Toggle */}
                        <motion.div
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                          variants={itemVariants}
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              Publish Batch
                            </p>
                            <p className="text-sm text-gray-600">
                              Make this batch available to students
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isPublished"
                              checked={batchData.isPublished}
                              onChange={handleBatchInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </motion.div>
                      </div>
                    </div>

                    {/* Navigation Button */}
                    <div className="flex justify-end pt-8 mt-8 border-t">
                      <motion.button
                        type="button"
                        onClick={() => setActiveSection("videos")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{newVideos.length > 0 ? `Continue to Videos (${newVideos.length} added)` : "Add New Videos"}</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Add Videos Section */}
                {activeSection === "videos" && (
                  <motion.div
                    key="videos"
                    className="p-8"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <motion.div
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Add New Videos
                        </h2>
                        <p className="text-gray-600">
                          Upload new videos to add to your existing batch
                        </p>
                      </div>
                    </div>

                    {/* New Video Upload Section */}
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Upload New Videos</span>
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Select Video Files
                          </label>
                          <motion.input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideoFileUpload}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            whileHover={{ scale: 1.02 }}
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            Select multiple videos to add to your existing batch content.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Upload Progress Section */}
                    {uploadQueue.length > 0 && (
                      <motion.div
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          <span>Upload Progress ({uploadQueue.filter(item => item.status === 'done').length}/{uploadQueue.length} completed)</span>
                        </h3>

                        <div className="space-y-4">
                          {uploadQueue.map((queueItem) => (
                            <motion.div
                              key={queueItem.id}
                              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    {queueItem.status === "done" ? (
                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : queueItem.status === "error" ? (
                                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    ) : (
                                      <motion.svg
                                        className="w-5 h-5 text-blue-600"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </motion.svg>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 truncate max-w-xs">
                                      {queueItem.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {queueItem.status === "uploading" && "Uploading..."}
                                      {queueItem.status === "done" && "Upload complete"}
                                      {queueItem.status === "error" && "Upload failed"}
                                      {queueItem.status === "idle" && "Waiting to upload..."}
                                    </p>
                                  </div>
                                </div>

                                {queueItem.status !== "done" && queueItem.status !== "error" && (
                                  <motion.button
                                    type="button"
                                    onClick={() => removeFromQueue(queueItem.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </motion.button>
                                )}
                              </div>

                              {queueItem.status === "uploading" && (
                                <div className="space-y-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <motion.div
                                      className="bg-blue-600 h-2.5 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${queueItem.progress}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>Uploading...</span>
                                    <span>{queueItem.progress}%</span>
                                  </div>
                                </div>
                              )}

                              {queueItem.status === "done" && (
                                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-green-700 font-medium">
                                    Ready to add to batch
                                  </span>
                                  <span className="text-green-600 text-sm">
                                    ({Math.round(queueItem.duration)}s)
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* New Videos List */}
                    {newVideos.length > 0 && (
                      <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <span>New Videos to Add ({newVideos.length})</span>
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {newVideos.filter(v => v.isFree).length} Free Preview
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {newVideos.map((video, index) => (
                            <motion.div
                              key={video.id}
                              className="bg-white border border-blue-200 rounded-2xl p-6 hover:shadow-md transition-all group"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                      </span>
                                      <div>
                                        <input
                                          type="text"
                                          value={video.title}
                                          onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)}
                                          className="font-bold text-gray-900 text-lg bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                                          placeholder="Enter video title"
                                        />
                                      </div>
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={video.isFree}
                                        onChange={() => toggleVideoFreeStatus(video.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Free Preview
                                      </span>
                                    </label>
                                    {video.isFree && (
                                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                                        Free Preview
                                      </span>
                                    )}
                                  </div>

                                  <div className="mb-4">
                                    <textarea
                                      value={video.description}
                                      onChange={(e) => handleVideoChange(video.id, 'description', e.target.value)}
                                      rows="2"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                      placeholder="Add video description (optional)..."
                                    />
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <span>{Math.round(video.duration)}s</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                        />
                                      </svg>
                                      <span>Ready to add</span>
                                    </span>
                                  </div>
                                </div>

                                <div className="ml-4">
                                  <motion.button
                                    type="button"
                                    onClick={() => removeNewVideo(video.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove video"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-between items-center pt-8 mt-8 border-t">
                      <motion.button
                        type="button"
                        onClick={() => setActiveSection("batch")}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        whileHover={{ x: -5 }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Back to Batch Details</span>
                      </motion.button>

                      <div className="flex items-center space-x-4">
                        <motion.button
                          type="button"
                          onClick={() => navigate("/teacherdashboard/main")}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={
                            isLoading ||
                            !batchData.name ||
                            !batchData.description ||
                            !batchData.domain ||
                            !batchData.thumbnail
                          }
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold shadow-lg flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isLoading ? (
                            <>
                              <motion.svg
                                className="h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </motion.svg>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{newVideos.length > 0 ? `Update Batch (Add ${newVideos.length} Videos)` : "Update Batch"}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateBatch;