// CreateBatch.jsx
import React, { useState } from 'react';
import Axios from 'axios';
import useUserStore from '../store/zustandstore';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header'; // Import the Header component
import { useNavigate } from 'react-router';

const CreateBatch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [videoloading, SetVideoLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('batch');
  const CurrentUser = useUserStore((state) => state.user);
  const navigate=useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const sectionVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Main batch form data
  const [batchData, setBatchData] = useState({
    name: '',
    domain: '',
    thumbnail: '',
    price: '',
    isPublished: false,
    PublishedBy: ''
  });

  // Videos array
  const [videos, setVideos] = useState([]);

  // Current video being added
  const [currentVideo, setCurrentVideo] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
    isFree: false,
    duration: ''
  });

  // Handle batch form input changes
  const handleBatchInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBatchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle video input changes
  const handleVideoInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentVideo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

      const res = await Axios.post("https://api.cloudinary.com/v1_1/dvwmxedd9/image/upload", formdata);
      console.log(res.data.secure_url);
      
      setBatchData(prev => ({ ...prev, thumbnail: res.data.secure_url }));
      setThumbnailLoading(false);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setThumbnailLoading(false);
    }
  };

  // Handle video file upload
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    SetVideoLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "VINEET");
      formdata.append("cloud_name", "dvwmxedd9");
      formdata.append("resource_type", "video");

      const res = await Axios.post("https://api.cloudinary.com/v1_1/dvwmxedd9/video/upload", formdata);
      setCurrentVideo(prev => ({ 
        ...prev, 
        videoFile: file,
        videoUrl: res.data.secure_url,
        duration: Math.round(res.data.duration) || '0'
      }));
      SetVideoLoading(false);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // Add video to the list
  const addVideo = () => {
    if (!currentVideo.title || !currentVideo.videoUrl) {
      alert('Please fill video title and upload video file');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title: currentVideo.title,
      description: currentVideo.description,
      videoUrl: currentVideo.videoUrl,
      isFree: currentVideo.isFree,
      duration: currentVideo.duration,
      order: videos.length + 1
    };

    setVideos(prev => [...prev, newVideo]);
    
    // Reset current video form
    setCurrentVideo({
      title: '',
      description: '',
      videoFile: null,
      videoUrl: '',
      isFree: false,
      duration: ''
    });
  };

  // Remove video from list
  const removeVideo = (videoId) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
  };

  // Move video up in order
  const moveVideoUp = (index) => {
    if (index === 0) return;
    const newVideos = [...videos];
    [newVideos[index], newVideos[index - 1]] = [newVideos[index - 1], newVideos[index]];
    setVideos(newVideos);
  };

  // Move video down in order
  const moveVideoDown = (index) => {
    if (index === videos.length - 1) return;
    const newVideos = [...videos];
    [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
    setVideos(newVideos);
  };

  // Submit batch
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchData.name || !batchData.domain || videos.length === 0) {
      alert('Please fill all required fields and add at least one video');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const finalBatchData = {
        ...batchData,
        PublishedBy: CurrentUser.email,
        videos: videos,
        totalVideos: videos.length,
        freeVideos: videos.filter(video => video.isFree).length
      };

      console.log(finalBatchData);

      const res = await fetch(`${import.meta.env.VITE_BASEURL}/createbatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(finalBatchData)
      });

      if (!res.ok) {
        throw new Error("Failed to create batch");
      }

      const data = await res.json();
      alert('Batch created successfully!');
      navigate("/teacherdashboard")

      setBatchData({
        name: '',
        description: '',
        domain: '',
        thumbnail: '',
        price: '',
        isPublished: false
      });
      setVideos([]);
      
    } catch (err) {
      console.error("Error creating batch:", err);
      alert('Error creating batch. Please try again.');
    }
    setIsLoading(false);
  };

  // Domain options
  const domainOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence'
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Use Header Component */}
      <Header 
        title="Create New Batch"
        userName={CurrentUser?.firstName || 'Educator'}
        userImage={CurrentUser?.imageUrl || '/default-avatar.png'}
      />

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create New Batch
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create and publish your new course batch with engaging content and structured curriculum
            </motion.p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-sm border">
              <motion.button
                onClick={() => setActiveSection('batch')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeSection === 'batch' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Batch Details</span>
              </motion.button>
              <div className="w-8 h-px bg-gray-300"></div>
              <motion.button
                onClick={() => setActiveSection('videos')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeSection === 'videos' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Add Videos</span>
              </motion.button>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div 
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                {/* Batch Information Section */}
                {activeSection === 'batch' && (
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
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Batch Information</h2>
                        <p className="text-gray-600">Basic details about your course batch</p>
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
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
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
                            <option value="" className="text-gray-500">Select a domain</option>
                            {domainOptions.map((domain, index) => (
                              <option key={index} value={domain} className="py-2">{domain}</option>
                            ))}
                          </select>
                        </motion.div>

                        {/* Thumbnail Upload */}
                        <motion.div variants={itemVariants}>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Thumbnail <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-4">
                            <input className="hidden disabled:cursor-not-allowed"
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
                              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <p className="text-gray-600 group-hover:text-blue-600 font-medium">
                                  {thumbnailLoading ? 'Uploading...' : 'Click to upload thumbnail'}
                                </p>
                                <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
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
                                    onClick={() => setBatchData(prev => ({ ...prev, thumbnail: '' }))}
                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-90 group-hover:scale-100"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                            <p className="font-semibold text-gray-800">Publish Batch</p>
                            <p className="text-sm text-gray-600">Make this batch available to students</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isPublished"
                              checked={batchData.isPublished}
                              onChange={handleBatchInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                            </div>
                          </label>
                        </motion.div>
                      </div>
                    </div>

                    {/* Navigation Button */}
                    <div className="flex justify-end pt-8 mt-8 border-t">
                      <motion.button
                        type="button"
                        onClick={() => setActiveSection('videos')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Continue to Videos</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Videos Section */}
                {activeSection === 'videos' && (
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
                        className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add Videos</h2>
                        <p className="text-gray-600">Create your course curriculum by adding videos</p>
                      </div>
                    </div>

                    {/* Current Video Form */}
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add New Video</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Video Title */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Video Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={currentVideo.title}
                            onChange={handleVideoInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter video title"
                          />
                        </div>

                        {/* Video Upload */}
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-semibold text-gray-800 mb-3">
                            Video File <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            {!videoloading && 
                              <motion.input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileUpload}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                whileHover={{ scale: 1.02 }}
                              />
                            }

                            {videoloading && 
                              <motion.div
                                className="flex items-center justify-center p-6 bg-blue-50 rounded-xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <motion.div
                                    className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                  <span className="text-blue-700 font-medium">Video is uploading...</span>
                                </div>
                              </motion.div>
                            }
                            {currentVideo.videoUrl && (
                              <motion.div 
                                className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-700 font-medium">Video uploaded successfully</span>
                                <span className="text-green-600 text-sm">({currentVideo.duration} seconds)</span>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Free Video Checkbox */}
                        <div className="lg:col-span-2">
                          <label className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                            <input
                              type="checkbox"
                              name="isFree"
                              checked={currentVideo.isFree}
                              onChange={handleVideoInputChange}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">Free Preview Video</p>
                              <p className="text-sm text-gray-600">Make this video available for free to attract students</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Add Video Button */}
                      <div className="flex justify-end pt-6">
                        <motion.button
                          type="button"
                          onClick={addVideo}
                          disabled={!currentVideo.title || !currentVideo.videoUrl}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold shadow-lg flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add Video to Batch</span>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Videos List */}
                    {videos.length > 0 && (
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Course Videos ({videos.length})</span>
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {videos.filter(v => v.isFree).length} Free
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                              Total: {videos.length}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {videos.map((video, index) => (
                            <motion.div 
                              key={video.id} 
                              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all group"
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
                                      <h4 className="font-bold text-gray-900 text-lg">{video.title}</h4>
                                    </div>
                                    {video.isFree && (
                                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                                        Free Preview
                                      </span>
                                    )}
                                  </div>
                                  
                                  {video.description && (
                                    <p className="text-gray-600 mb-3 leading-relaxed">{video.description}</p>
                                  )}
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span>{video.duration}s</span>
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <motion.button
                                    type="button"
                                    onClick={() => moveVideoUp(index)}
                                    disabled={index === 0}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move up"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    onClick={() => moveVideoDown(index)}
                                    disabled={index === videos.length - 1}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move down"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    onClick={() => removeVideo(video.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove video"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                        onClick={() => setActiveSection('batch')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        whileHover={{ x: -5 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Batch Details</span>
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={isLoading || !batchData.name || !batchData.domain || videos.length === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-12 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold shadow-xl flex items-center space-x-3"
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
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </motion.svg>
                            <span>Creating Batch...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Create Batch</span>
                          </>
                        )}
                      </motion.button>
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

export default CreateBatch;