import React from "react";
import Profilelogo from "./Profilelogo";
import { IoMdNotificationsOutline } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="h-18  w-full bg-gradient-to-l  from-[#45d85e] to-[#1F4926] shadow-md flex items-center px-6 ">
      <div className="flex">
        <div className="  ">
          <h1 className="sm:text-sm md:text-lg lg:text-2xl xl:text-3xl  font-bold italic flex text-white text-center mt-4 pb-3   tracking-wide">
            Bharat 
          <span>  <h1 className="pl-1 text-emerald-300 sm:text-sm md:text-lg lg:text-2xl xl:text-3xl">
              Metal Grid
            </h1></span>
          </h1>
        </div>
        <div className=" right-3 top-0.5  flex absolute">
          <div className="text-4xl mt-4 m-3 bg-white text-red-400 rounded-full">
            <IoMdNotificationsOutline />
          </div>
          <div className="">
            <Profilelogo></Profilelogo>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
