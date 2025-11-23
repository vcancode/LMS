import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const Signup = () => {

  const baseurl=import.meta.env.VITE_BASEURL
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    imageUrl:"https://img.icons8.com/fluent/1200/test-account.jpg",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseurl}/saveuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.token){
        console.log(data.token);
        localStorage.setItem('token',data.token);
        navigate("/dashboard")
      }
      console.log(data);
    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* 👇 Login link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
