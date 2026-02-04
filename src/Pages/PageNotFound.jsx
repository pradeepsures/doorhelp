import React from "react";
import { motion } from "framer-motion";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-200 text-center px-4">
      {/* Animated Image */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" // 👈 apna image yaha daal lena
        alt="Not Found"
        className="w-40 h-40 mb-8"
        animate={{
          y: [0, -30, 0], // up-down bounce
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Text */}
      <h1 className="text-6xl font-extrabold text-green-700 drop-shadow-lg mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      {/* <a
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300"
      >
        Go Back Home
      </a> */}
    </div>
  );
}
