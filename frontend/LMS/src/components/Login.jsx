import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {

const baseurl = import.meta.env.VITE_BASEURL;
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Call your backend API
      const response = await axios.post(`${baseurl}/loginuser`, formData);

      // 🔹 Save token in localStorage
      localStorage.setItem("token", response.data.token);

      console.log(response);
      

      // 🔹 Redirect to dashboard
     if (response.status === 200) {
  navigate("/dashboard");
}
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {error && (
          <p className="text-red-600 text-center mb-3 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <NavLink to="/signup" className="text-indigo-600 hover:underline font-medium">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
