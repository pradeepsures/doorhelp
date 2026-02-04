import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error } = await login({ email, password });
    if (success) {
      navigate("/home");
    } else {
      alert("Login failed. Please check credentials.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex p-3 justify-end relative overflow-hidden">
      {/* Background Image */}

      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/grid.png"
        alt="Background"
      />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-red-300"
        data-aos="zoom-in"
      >
        {/* Logo */}
        <div className="flex justify-center mb-2 mt-4">
          <img
            className="h-34 w-34 rounded-full"
            src="/images/appLogo.png"
            alt="Logo"
          />
        </div>

        {/* Form Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-tight">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white
             bg-gradient-to-r from-blue-400 to-blue-600
             shadow-lg shadow-blue-900/40
             transition-all duration-300
             hover:from-blue-800 hover:to-blue-950
             hover:shadow-red-300
             hover:-translate-y-0.5 hover:scale-[1.02]
             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Log In
          </button>

          {/* <button
            type="submit"
            className="w-full py-3 bg-[#1F4926] text-white rounded-lg font-semibold hover:bg-[#16381d] focus:outline-none focus:ring-2 focus:ring-[#1F4926] focus:ring-offset-2 transition duration-300 transform hover:scale-105"
          >
            Log In
          </button> */}
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-[#1F4926] hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
