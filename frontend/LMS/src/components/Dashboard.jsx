import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/zustandstore";

const Dashboard = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const baseurl = import.meta.env.VITE_BASEURL;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseurl}/getuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const user = await res.json();
        console.log("User:", user);

        // 👉 Store user in Zustand
        setUser(user);

        // 👉 Route based on role
        if (user.role === "student") navigate("/studentdashboard");
        if (user.role === "teacher") navigate("/teacherdashboard/main");

      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    if (token) fetchUser();
    else navigate("/login");
  }, []);

  return <div></div>;
};

export default Dashboard;
