// TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import Axios from "axios";
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header'; // Import the Header component

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
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
        duration: 0.3
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Mock data - replace with actual data from your backend
  const [teacherData, setTeacherData] = useState({
    firstName: "John",
    lastName: "Doe",
    role: "Teacher",
    email: "john.doe@example.com",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const [myBatches, setMyBatches] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        console.log(data);
        
        setTeacherData(data);
        setMyBatches(data.Batches || []);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, []);

  const handleSaveProfile = async(updatedData) => {
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
      
      setTeacherData({...teacherData, firstName: data.user.firstName, lastName: data.user.lastName, imageUrl: data.user.imageUrl });
      
    } catch (err) {
      console.error("Error updating user:", err);
    }

    setIsEditModalOpen(false);
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F9FAFB]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Use Header Component */}
      <Header 
        title="Teacher Dashboard"
        userName={teacherData.firstName}
        userImage={teacherData.imageUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <motion.div 
          className="border-b border-gray-200 mb-8"
          variants={itemVariants}
        >
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profile' },
              { id: 'batches', name: 'My Batches' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.name}
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
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Profile Header with Background */}
                    <div className="bg-gradient-to-r from-[#4F46E5] to-[#38BDF8] h-32 relative">
                      <motion.div 
                        className="absolute -bottom-16 left-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                          <img 
                            src={teacherData.imageUrl} 
                            alt={`${teacherData.firstName} ${teacherData.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 px-8 pb-8">
                      <div className="flex justify-between items-start mb-8">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h2 className="text-3xl font-bold text-[#111827]">
                            {teacherData.firstName} {teacherData.lastName}
                          </h2>
                          <p className="text-[#6B7280] text-lg mt-1">{teacherData.role}</p>
                        </motion.div>
                        <motion.button 
                          onClick={() => setIsEditModalOpen(true)}
                          className="bg-[#4F46E5] text-white py-3 px-6 rounded-xl hover:bg-[#38BDF8] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit Profile
                        </motion.button>
                      </div>

                      {/* Personal Information Only */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-2xl">
                          <motion.div 
                            className="bg-gray-50 p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Personal Information
                            </h3>
                            <div className="space-y-3">
                              <motion.div 
                                className="flex justify-between py-2 border-b border-gray-200"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                              >
                                <span className="text-[#6B7280]">First Name</span>
                                <span className="font-medium text-[#111827]">{teacherData.firstName}</span>
                              </motion.div>
                              <motion.div 
                                className="flex justify-between py-2 border-b border-gray-200"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                              >
                                <span className="text-[#6B7280]">Last Name</span>
                                <span className="font-medium text-[#111827]">{teacherData.lastName}</span>
                              </motion.div>
                              <motion.div 
                                className="flex justify-between py-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                              >
                                <span className="text-[#6B7280]">Email</span>
                                <span className="font-medium text-[#111827]">{teacherData.email || "john.doe@example.com"}</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* My Batches Section */}
              {activeTab === 'batches' && (
                <motion.div
                  key="batches"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-[#111827] mb-6">My Batches ({myBatches.length})</h2>
                    <div className="space-y-6">
                      {myBatches.map((batch, index) => (
                        <motion.div 
                          key={batch.id} 
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-6">
                              <div className="mb-4">
                                <h3 className="text-xl font-semibold text-[#111827] mb-2">{batch.name}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="font-medium text-[#111827]">{batch.domain}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{batch.lecturesUploaded} lectures</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>By {batch.instructor}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <motion.button 
                                className="w-full bg-[#4F46E5] text-white py-3 px-6 rounded-lg hover:bg-[#38BDF8] transition-colors font-medium text-lg flex items-center justify-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                Manage Batch
                              </motion.button>
                            </div>
                            
                            <div className="md:w-64 flex-shrink-0 p-2">
                              <motion.img 
                                src={batch.thumbnail} 
                                alt={batch.name}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Cards Section */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* All Batches Card */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border p-6"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto w-16 h-16 bg-[#4F46E5] rounded-full flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-[#111827] mb-3">Explore All Batches</h3>
              <p className="text-[#6B7280] text-sm mb-6">
                Discover new courses and expand your knowledge with our wide range of batches. Get batches up to 30% off.
              </p>
              <motion.button 
                className="w-full bg-[#4F46E5] text-white py-3 px-6 rounded-lg hover:bg-[#38BDF8] transition-colors font-medium text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse All Batches
              </motion.button>
            </div>
          </motion.div>

          {/* Create New Batch Card */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border p-6"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto w-16 h-16 bg-[#4F46E5] rounded-full flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-[#111827] mb-3">Create New Batch</h3>
              <p className="text-[#6B7280] text-sm mb-6">
                Start a new batch and share your knowledge with students. Create engaging content and manage your courses effectively.
              </p>
              <motion.button 
                onClick={()=>{navigate("/createbatch")}}
                className="w-full bg-[#4F46E5] text-white py-3 px-6 rounded-lg hover:bg-[#38BDF8] transition-colors font-medium text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Batch
              </motion.button>
            </div>
          </motion.div>

          {/* AI Chatbot Card */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border p-6"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div 
                className="mx-auto w-16 h-16 bg-[#4F46E5] rounded-full flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-[#111827] mb-3">AI Teaching Assistant</h3>
              <p className="text-[#6B7280] text-sm mb-6">
                Get instant, personalized teaching help from our AI 24/7. Ask anything — course planning, content creation, student engagement strategies.
              </p>
              <motion.button 
                className="w-full bg-[#4F46E5] text-white py-3 px-6 rounded-lg hover:bg-[#38BDF8] transition-colors font-medium text-lg"
                whileHover={{ scale: 1.02 }}
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
            teacherData={teacherData}
            onSave={handleSaveProfile}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Edit Profile Component with Animations
const EditProfileModal = ({ teacherData, onSave, onClose }) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        imageUrl: teacherData.imageUrl
    });

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

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
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[#111827]">Edit Profile</h2>
                        <motion.button 
                            onClick={onClose}
                            className="text-[#6B7280] hover:text-[#111827]"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4F46E5] hover:border-[#38BDF8] transition-colors">
                                        <img 
                                            src={formData.imageUrl} 
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </motion.label>
                                <div className="text-center mt-2">
                                    <span className="text-sm text-[#6B7280]">Click photo to upload</span>
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-medium text-[#6B7280] mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                required
                            />
                        </motion.div>

                        {/* Last Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-medium text-[#6B7280] mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                required
                            />
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div 
                            className="flex space-x-4 pt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 px-4 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={imageLoading}
                                className={`flex-1 bg-[#4F46E5] text-white py-2 px-4 rounded-lg hover:bg-[#38BDF8] transition-colors font-medium disabled:cursor-not-allowed`}
                                whileHover={{ scale: imageLoading ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {imageLoading ? (
                                    <motion.span
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        uploading...
                                    </motion.span>
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

export default TeacherDashboard;