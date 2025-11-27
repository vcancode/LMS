import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/zustandstore';

const Header = ({ title, userName, userImage }) => {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    localStorage.removeItem("token");   // Remove token
    clearUser();                        // Clear Zustand user store
    navigate("/");                      // Navigate to main page
    localStorage.removeItem("user-store"); 
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center space-x-6">

            {/* Welcome Text */}
            <span className="text-[#6B7280]">Welcome, {userName}</span>

            {/* Profile Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={userImage} 
                alt="Profile image" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg 
                         font-semibold transition-all"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
