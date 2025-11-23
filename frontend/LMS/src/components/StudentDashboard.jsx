// StudentDashboard.jsx
import React, { useState } from 'react';
import Axios from "axios";
import Header from './Header';
import useUserStore from '../store/zustandstore';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get user data directly from Zustand store
  const { user } = useUserStore();
  
  const studentData = {
    firstName: user?.firstName || "Student",
    lastName: user?.lastName || "",
    role: "Student",
    email: user?.email || "",
    imageUrl: user?.imageUrl || ""
  };

  const paidBatches = user?.Batches || [];

  const handleSaveProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");

      const updateData = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        imageUrl: updatedData.imageUrl
      };

      const res = await fetch("http://localhost:5000/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      const data = await res.json();
      
      // Update Zustand store with new data
      useUserStore.getState().setUser(data.user);
      
    } catch (err) {
      console.error("Error updating user:", err);
    }

    setIsEditModalOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F9FAFB]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <Header 
        title="Student Dashboard" 
        userName={`${studentData.firstName} ${studentData.lastName}`}
        userImage={studentData.imageUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <motion.div 
          className="border-b border-gray-200 mb-8"
          variants={itemVariants}
        >
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'batches', name: 'My Batches', icon: '🎓' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={tabVariants}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        <div className="flex justify-center">
          {/* Main Content - Centered */}
          <div className="w-full max-w-4xl space-y-8">
            <AnimatePresence mode="wait">
              {/* Enhanced Profile Section */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Profile Header with Background */}
                  <div className="bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] h-32 relative">
                    <motion.div 
                      className="absolute -bottom-16 left-8"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white relative group">
                        <img 
                          src={studentData.imageUrl || "/default-avatar.png"} 
                          alt={`${studentData.firstName} ${studentData.lastName}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <motion.button
                            onClick={() => setIsEditModalOpen(true)}
                            className="opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-50 rounded-full p-2 transition-all"
                            whileHover={{ scale: 1.1 }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Profile Content */}
                  <div className="pt-20 px-8 pb-8">
                    <motion.div 
                      className="flex justify-between items-start mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div>
                        <h2 className="text-3xl font-bold text-[#111827]">
                          {studentData.firstName} {studentData.lastName}
                        </h2>
                        <p className="text-[#6B7280] text-lg mt-1 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {studentData.role}
                        </p>
                      </div>
                      <motion.button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md flex items-center space-x-2"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Profile</span>
                      </motion.button>
                    </motion.div>

                    {/* Personal Information Only */}
                    <motion.div 
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="w-full max-w-2xl">
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm">
                          <h3 className="text-xl font-semibold text-[#111827] mb-6 flex items-center justify-center">
                            <svg className="w-6 h-6 mr-3 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Personal Information
                          </h3>
                          <div className="space-y-4">
                            <motion.div 
                              className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm border border-gray-100"
                              whileHover={{ scale: 1.02, x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <span className="text-[#6B7280]">First Name</span>
                              </div>
                              <span className="font-semibold text-[#111827] text-lg">{studentData.firstName}</span>
                            </motion.div>
                            
                            <motion.div 
                              className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm border border-gray-100"
                              whileHover={{ scale: 1.02, x: 5 }}
                              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <span className="text-[#6B7280]">Last Name</span>
                              </div>
                              <span className="font-semibold text-[#111827] text-lg">{studentData.lastName}</span>
                            </motion.div>
                            
                            <motion.div 
                              className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm border border-gray-100"
                              whileHover={{ scale: 1.02, x: 5 }}
                              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="text-[#6B7280]">Email</span>
                              </div>
                              <span className="font-semibold text-[#111827] text-lg">{studentData.email || "Not provided"}</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Paid Batches Section */}
              {activeTab === 'batches' && (
                <motion.div
                  key="batches"
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="flex items-center justify-between mb-8"
                    variants={itemVariants}
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-[#111827] flex items-center">
                        <svg className="w-8 h-8 mr-3 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Learning Batches
                      </h2>
                      <p className="text-[#6B7280] mt-2">Continue your learning journey with these courses</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
                        {paidBatches.length} {paidBatches.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                  </motion.div>

                  {paidBatches.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      variants={containerVariants}
                    >
                      <AnimatePresence>
                        {paidBatches.map((batch, index) => (
                          <motion.div
                            key={batch.id}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <div className="relative overflow-hidden">
                              <img 
                                src={batch.thumbnail} 
                                alt={batch.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 right-4">
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                  Enrolled
                                </span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <h3 className="text-white font-bold text-lg truncate">{batch.name}</h3>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {batch.domain}
                                </span>
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {batch.totalVideos || 0} videos
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {batch.freeVideos || 0} free previews
                                </div>
                                <div className="text-sm font-semibold text-[#4F46E5]">
                                  ₹{batch.price || 'Free'}
                                </div>
                              </div>

                              <motion.button 
                                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-2 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                <span>Continue Learning</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't enrolled in any courses yet. Explore our catalog to start your learning journey!
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Browse Courses
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Cards Section */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {/* All Batches Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto w-20 h-20 bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Explore All Batches</h3>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                Discover new courses and expand your knowledge with our wide range of batches. Special discounts available for students!
              </p>
              <motion.button 
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-4 px-8 rounded-xl hover:shadow-lg transition-all font-semibold text-lg shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse All Batches
              </motion.button>
            </div>
          </motion.div>

          {/* AI Chatbot Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto w-20 h-20 bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">AI Learning Assistant</h3>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                Get instant, personalized study help from our AI 24/7. Ask anything — concepts, summaries, step-by-step explanations, or get recommended resources.
              </p>
              <motion.button 
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-4 px-8 rounded-xl hover:shadow-lg transition-all font-semibold text-lg shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Start AI Chat
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal 
            studentData={studentData}
            onSave={handleSaveProfile}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Edit Profile Component
const EditProfileModal = ({ studentData, onSave, onClose }) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        imageUrl: studentData.imageUrl
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleImageUpload = async (e) => {
        setImageLoading(true);
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append("upload_preset", "VINEET");
            formdata.append("cloud_name", "dvwmxedd9");
            
            const res = await Axios.post("https://api.cloudinary.com/v1_1/dvwmxedd9/image/upload", formdata);
            setFormData({...formData, imageUrl: res.data.secure_url});
            setImageLoading(false);
        } catch (error) {
            console.log(error);
            setImageLoading(false);
        }
    };

    return (
        <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-[#111827]">Edit Profile</h2>
                        <motion.button 
                            onClick={onClose}
                            className="text-[#6B7280] hover:text-[#111827] p-2 rounded-lg hover:bg-gray-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Picture Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="profilePictureUpload"
                                />
                                <motion.label
                                    htmlFor="profilePictureUpload"
                                    className="cursor-pointer block relative group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#4F46E5] hover:border-[#38BDF8] transition-colors shadow-lg">
                                        {imageLoading ? (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <motion.div 
                                                    className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                            </div>
                                        ) : (
                                            <img 
                                                src={formData.imageUrl || "/default-avatar.png"} 
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </motion.label>
                                <div className="text-center mt-4">
                                    <span className="text-sm text-[#6B7280]">Click to upload profile picture</span>
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-[#6B7280]">
                                First Name
                            </label>
                            <motion.input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>

                        {/* Last Name */}
                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-semibold text-[#6B7280]">
                                Last Name
                            </label>
                            <motion.input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                                required
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div 
                            className="flex space-x-4 pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 border border-gray-300 text-[#111827] rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={imageLoading}
                                className={`flex-1 bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all font-semibold ${imageLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                                whileHover={imageLoading ? {} : { scale: 1.02 }}
                                whileTap={imageLoading ? {} : { scale: 0.98 }}
                            >
                                {imageLoading ? (
                                    <span className="flex items-center justify-center">
                                        <motion.span 
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Uploading...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </motion.button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentDashboard;