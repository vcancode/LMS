import { motion } from "framer-motion";

const BatchView = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
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

  const slideInVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Container */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Batch Details */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={slideInVariants}
            >
              {/* Batch Header */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <motion.h1
                      className="text-4xl font-bold text-gray-900"
                      variants={itemVariants}
                    >
                      Advanced React Masterclass 2024
                    </motion.h1>
                    <motion.p
                      className="text-lg text-blue-600 font-semibold"
                      variants={itemVariants}
                    >
                      Web Development
                    </motion.p>
                  </div>
                </div>

                {/* Batch Stats */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  variants={itemVariants}
                >
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    <span className="text-sm font-medium text-blue-700">
                      15 Videos
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-700">
                      3 Free Previews
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span className="text-sm font-medium text-purple-700">
                      ₹2,999
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Batch Description */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>About This Batch</span>
                </h2>
                <motion.div
                  className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                  variants={itemVariants}
                >
                  <p>
                    Master advanced React concepts and build scalable applications with this comprehensive course. Learn from industry experts and gain hands-on experience with real-world projects.
                  </p>
                  <p>
                    This batch covers everything from fundamental concepts to advanced patterns, including state management, performance optimization, and modern React features.
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-500"
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
                      <span>Advanced React Patterns and Best Practices</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-500"
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
                      <span>State Management with Redux and Context API</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-500"
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
                      <span>Performance Optimization Techniques</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              {/* Watch Lectures Section */}
              <motion.div className="space-y-6" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
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
                    <span>Course Lectures</span>
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      15 Lectures
                    </span>
                  </div>
                </div>

                {/* Lectures List */}
                <motion.div
                  className="space-y-4"
                  variants={staggerListVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Lecture Item 1 */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                    variants={listItemVariants}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <span className="text-lg font-bold text-blue-600">1</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Introduction to Advanced React
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Get started with advanced React concepts and project setup
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center space-x-1 text-sm text-gray-500">
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
                              <span>15:30</span>
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              Free Preview
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium transition-all transform -translate-x-2 group-hover:translate-x-0 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Watch Now
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Lecture Item 2 */}
                  <motion.div
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                    variants={listItemVariants}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <span className="text-lg font-bold text-gray-600">2</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            React Hooks Deep Dive
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Master useState, useEffect, and custom hooks
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center space-x-1 text-sm text-gray-500">
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
                              <span>22:45</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium transition-all transform -translate-x-2 group-hover:translate-x-0 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Watch Now
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Lecture Item 3 */}
                  <motion.div
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                    variants={listItemVariants}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <span className="text-lg font-bold text-gray-600">3</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            State Management with Context API
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Learn to manage global state effectively
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center space-x-1 text-sm text-gray-500">
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
                              <span>18:20</span>
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              Free Preview
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium transition-all transform -translate-x-2 group-hover:translate-x-0 hover:bg-blue-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Watch Now
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* More lectures would continue here... */}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Thumbnail and Additional Info */}
            <motion.div
              className="space-y-6"
              variants={slideInVariants}
            >
              {/* Thumbnail Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="Course Thumbnail"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Course Thumbnail
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Visual representation of this comprehensive React course
                  </p>
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enroll in Batch
                  </motion.button>
                </div>
              </motion.div>

              {/* Additional Info Card */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200"
                variants={itemVariants}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Batch Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600">Instructor</span>
                    <span className="font-semibold text-gray-900">John Doe</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">8 Weeks</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold text-gray-900">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold text-gray-900">Jan 15, 2024</span>
                  </div>
                </div>
              </motion.div>

              {/* Progress Card */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
                variants={itemVariants}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-gray-900">5/15 Lectures</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-green-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "33%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    33% Complete
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BatchView;