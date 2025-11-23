import React from 'react';
import { Route,NavLink,useNavigate,BrowserRouter,Routes } from 'react-router-dom'

const LandingPage = () => {
    const navigate=useNavigate()
  const features = [
    {
      icon: "📚",
      title: "Course Library",
      description: "Access hundreds of courses across various domains and skill levels"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and reports"
    },
    {
      icon: "👨‍🏫",
      title: "Expert Instructors",
      description: "Learn from industry professionals and certified educators"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Learn on the go with our responsive mobile application"
    },
    {
      icon: "🎓",
      title: "Certification",
      description: "Earn recognized certificates upon course completion"
    },
    {
      icon: "💬",
      title: "Community Support",
      description: "Connect with peers and instructors in dedicated forums"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Courses" },
    { number: "200+", label: "Expert Instructors" },
    { number: "95%", label: "Completion Rate" }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-[#111827] text-xl font-bold">VGyan</span>
        </div>
        

        <div className="flex items-center space-x-4">
          <button onClick={()=>{
              navigate("/signup")
            }} className="bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#38BDF8] transition-colors duration-300">
            Sign In/Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#111827] mb-6">
            Transform Your Learning with{' '}
            <span className="text-[#4F46E5]">VGyan</span>
          </h1>
          <p className="text-[#6B7280] text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
            Experience the future of education with our comprehensive Learning Management System. 
            Personalized learning paths, interactive content, and expert guidance - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={()=>{
              navigate("/dashboard")
            }} className="bg-[#4F46E5] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#38BDF8] transition-colors duration-300 shadow-lg w-full sm:w-auto">
              GetStarted
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#4F46E5] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#6B7280] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Why Choose VGyan?
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Discover the features that make VGyan the preferred choice for modern learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
    
    

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-xl font-bold">VGyan</span>
              </div>
              <p className="text-[#9CA3AF]">
                Empowering learners worldwide with quality education and innovative technology.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#374151] mt-8 pt-8 text-center text-[#9CA3AF]">
            <p>© 2024 VGyan LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;