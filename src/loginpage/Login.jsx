
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    const { success, error } = await login({
      email,
      password,
    });

    if (success) {
      navigate("/home");
    } else {
      alert("Login failed. Please check credentials.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-end p-3 relative overflow-hidden">

      {/* Background */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/doorhelpbg.png"
        alt="Background"
      />


      {/* Login Card */}
      <div
        className="relative z-10 w-[340px] md:w-[400px] mx-4 md:mx-8 my-6 rounded-2xl shadow-2xl px-7 md:px-10 py-9 md:py-10 transition-all duration-500 hover:shadow-blue-200/40"
        style={{ background: "#0D877F" }}
        data-aos="zoom-in"
      >

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            className="h-30 w-30 rounded-full object-cover"
            src="/images/doorhelpLogo.png"
            alt="Logo"
          />
        </div>


        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          DoorHelp
        </h1>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Email */}
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              required
            />
          </div>


          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>


            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />


              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-[#061B38]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58a2 2 0 102.83 2.83" />
                    <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.24-2.81 4.2-5.06 5.47" />
                    <path d="M6.61 6.61C4.62 7.86 3.03 9.74 2 12c1.73 3.89 6 7 10 7 1.43 0 2.8-.24 4.06-.68" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>


          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-[#061B38] shadow-lg transition-all duration-300 hover:bg-[#00113A] hover:scale-[1.02]"
          >
            Log In
          </button>

        </form>


        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="text-sm text-white">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-white underline hover:text-gray-200"
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