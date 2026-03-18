// // src/components/Sidebar.jsx
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// import { HiMenuAlt3 } from "react-icons/hi";
// import { MdOutlineDashboard } from "react-icons/md";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { GiNewspaper } from "react-icons/gi";
// import { PiFlagBannerFill } from "react-icons/pi";
// import { IoNotifications } from "react-icons/io5";
// import { MdRememberMe } from "react-icons/md";

// import { IoDocumentTextOutline, IoDocumentLockOutline } from "react-icons/io5";

// const Sidebar = () => {
//   const { hasPermission } = useAuth();
//   const [open, setOpen] = useState(true);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [activeSubMenu, setActiveSubMenu] = useState(null);

//   const navigate = useNavigate();

//   const menus = [
//     { name: "Dashboard", link: "/home", icon: MdOutlineDashboard },

//     {
//       name: "Members",
//       icon: MdRememberMe,
//       dropdownIcon: RiArrowDropDownLine,
//       subMenus: [
//         { name: "Members", link: "/home/Banner" },
//       ],
//     },

//      {
//       name: "Association",
//       icon: PiFlagBannerFill,
//       dropdownIcon: RiArrowDropDownLine,
//       subMenus: [
//         { name: "Associations", link: "/home/Banner" },
//       ],
//     },

//      {
//       name: "Industry News",
//       icon: GiNewspaper,
//       dropdownIcon: RiArrowDropDownLine,
//       subMenus: [
//         { name: "Industry News", link: "/home/industryNews/list" },
//       ],
//     },

//      {
//       name: "Latest Notice",
//       icon: IoNotifications,
//       dropdownIcon: RiArrowDropDownLine,
//       subMenus: [
//         { name: "Latest Notice", link: "/home/Banner" },
//       ],
//     },

//     {
//       name: "Term Condition",
//       link: "/home/termCondition",
//       icon: IoDocumentTextOutline,
//     },
//     {
//       name: "Privacy Policy",
//       link: "/home/privacyPolicy",
//       icon: IoDocumentLockOutline,
//     },
//     {
//       name: "AboutUs",
//       link: "/home/aboutUs",
//       icon: IoDocumentLockOutline,
//     },
//   ];

//   const filteredMenus = menus
//     .map((menu) => {
//       if (!menu.subMenus) return menu;
//       const visible = menu.subMenus.filter(
//         (s) => !s.sectionName || hasPermission(s.sectionName, "read")
//       );
//       return visible.length ? { ...menu, subMenus: visible } : null;
//     })
//     .filter(Boolean);

//   const handleMenuClick = (index) => {
//     setActiveMenu(activeMenu === index ? null : index);
//     setActiveSubMenu(null);
//   };

//   const handleSubMenuClick = (index, subIndex) => {
//     setActiveSubMenu(activeSubMenu === subIndex ? null : subIndex);
//     setActiveMenu(index);
//   };

//   return (
//     <section className="flex">
//       <div className="relative">
//         {/* Sidebar */}
//         <aside
//           className={`sidebar-gradient h-screen shadow-lg
//           ${open ? "w-[260px]" : "w-20"} duration-500 text-white flex flex-col`}
//         >
//           {/* Logo */}
//           <div className="flex flex-col items-center justify-center mt-4 mb-4 px-4">
//             <img
//               src="/images/appLogo.png"
//               className={`rounded-full transition-all duration-500 ${
//                 open ? "w-28" : "w-10"
//               }`}
//             />
//             <div className="flex justify-center items-center gap-x-10">
//               <h1
//                 className={`mt-3 text-center font-bold text-lg transition-all duration-700
//                 ${
//                   open
//                     ? "opacity-100 translate-x-0"
//                     : "opacity-0 -translate-x-10 hidden"
//                 }
//               `}
//               >
//               Bharat Metal Grid
//               </h1>

//               {/* Toggle Button */}

//               <HiMenuAlt3
//                 size={28}
//                 className="mt-4 p-1 rounded-full bg-[#1F4926] bg-opacity-80 cursor-pointer hover:scale-110 hover:bg-opacity-100 transition-all duration-200 shadow-lg"
//                 onClick={() => {
//                   setOpen(!open);
//                   setActiveMenu(null);
//                 }}
//               />
//             </div>
//           </div>

//           {/* Menu */}
//           <div className="flex-1 sidebar-scroll overflow-y-auto mt-4 pb-4 px-4">
//             {filteredMenus.map((menu, index) => (
//               <div key={index}>
//                 {/* Dropdown Menus */}
//                 {menu.subMenus ? (
//                   <>
//                     {/* Menu Row */}
//                     <div
//                       onClick={() => {
//                         if (!open) {
//                           if (menu.subMenus && menu.subMenus.length > 0) {
//                             setActiveMenu(index);
//                             navigate(menu.subMenus[0].link);
//                           }
//                         } else {
//                           handleMenuClick(index);
//                         }
//                       }}
//                       className={`group flex items-center rounded-md cursor-pointer menu-item mb-1
//                         ${
//                           activeMenu === index
//                             ? "bg-[#1F4926] bg-opacity-80 shadow-md"
//                             : "hover:bg-[#1F4926] hover:bg-opacity-60"
//                         }
//                         ${
//                           open
//                             ? "p-3 w-full justify-between"
//                             : "w-full h-12 justify-center"
//                         }
//                       `}
//                     >
//                       {/* ICON + TEXT */}
//                       <div
//                         className={`flex items-center gap-3 ${
//                           !open ? "justify-center" : ""
//                         }`}
//                       >
//                         <menu.icon size={20} />

//                         <span
//                           className={`whitespace-pre duration-300
//                             ${
//                               open
//                                 ? "opacity-100 translate-x-0"
//                                 : "opacity-0 -translate-x-6 hidden"
//                             }
//                           `}
//                         >
//                           {menu.name}
//                         </span>
//                       </div>

//                       {/* Dropdown Arrow */}
//                       {open && menu.dropdownIcon && (
//                         <menu.dropdownIcon
//                           size={22}
//                           className={`transition-transform duration-300 
//                             ${activeMenu === index ? "rotate-180" : ""}
//                           `}
//                         />
//                       )}

//                       {/* Tooltip */}
//                       {!open && (
//                         <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg transition-opacity duration-200 pointer-events-none">
//                           {menu.name}
//                         </span>
//                       )}
//                     </div>

//                     {/* Submenus */}
//                     <div
//                       className={`overflow-hidden transition-all duration-300 
//                         ${
//                           activeMenu === index && open
//                             ? "max-h-[500px] mt-1"
//                             : "max-h-0"
//                         }
//                       `}
//                     >
//                       {menu.subMenus.map((sub, si) => (
//                         <Link
//                           key={si}
//                           to={sub.link}
//                           onClick={() => handleSubMenuClick(index, si)}
//                           className="block text-sm py-3 pl-12 pr-3 hover:bg-[#1F4926] hover:bg-opacity-60 rounded-md mb-1 menu-item transition-all duration-200"
//                         >
//                           {sub.name}
//                         </Link>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   /* Normal menu (Dashboard, Privacy, etc.) */
//                   <Link
//                     to={menu.link}
//                     onClick={() => setActiveMenu(index)}
//                     className={`group flex items-center rounded-md cursor-pointer menu-item mb-1
//                       ${
//                         activeMenu === index
//                           ? "bg-[#1F4926] bg-opacity-80 shadow-md"
//                           : "hover:bg-[#1F4926] hover:bg-opacity-60"
//                       }
//                       ${
//                         open
//                           ? "p-3 w-full gap-3 justify-start"
//                           : "w-full h-12 justify-center"
//                       }
//                     `}
//                   >
//                     <menu.icon size={20} />

//                     <span
//                       className={`whitespace-pre duration-300
//                         ${
//                           open
//                             ? "opacity-100 translate-x-0"
//                             : "opacity-0 -translate-x-6 hidden"
//                         }
//                       `}
//                     >
//                       {menu.name}
//                     </span>

//                     {/* Tooltip */}
//                     {!open && (
//                       <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg transition-opacity duration-200 pointer-events-none">
//                         {menu.name}
//                       </span>
//                     )}
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </div>
//         </aside>
//       </div>

//       <section className="w-full"></section>
//     </section>
//   );
// };

// export default Sidebar;


// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GiNewspaper } from "react-icons/gi";
import { PiFlagBannerFill } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
import { RiFileList3Fill } from "react-icons/ri";
import { MdRememberMe } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { LuGalleryThumbnails } from "react-icons/lu";
import { MdEmojiEvents } from "react-icons/md";
import { GiVerticalBanner } from "react-icons/gi";


import {
  IoDocumentTextOutline,
  IoDocumentLockOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", link: "/home", icon: MdOutlineDashboard },

    {
      name: "Members",
      icon: MdRememberMe,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Members", link: "/home/members/list" }],
    },

    {
      name: "Association",
      icon: PiFlagBannerFill,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Associations", link: "/home/association/list" }],
    },

    {
      name: "Industry News",
      icon: GiNewspaper,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Industry News", link: "/home/industryNews/list" }],
    },

    {
      name: "Latest Notice",
      icon: IoNotifications,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Latest Notice", link: "/home/latest-notices/list" }],
    },

      {
      name: "Plans",
      icon: RiFileList3Fill,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "All Plans", link: "/home/plan/list" }],
    },

      {
      name: "AssignPlan",
      icon: FaClipboardCheck,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Assigned Plan", link: "/home/assignedPlan/list" }],
    },

      {
      name: "Gallery",
      icon: LuGalleryThumbnails,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Gallery", link: "/home/gallery/list" }],
    },

       {
      name: "Event",
      icon: MdEmojiEvents,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Event", link: "/home/event/list" }],
    },

      {
      name: "Banner",
      icon: GiVerticalBanner,
      dropdownIcon: RiArrowDropDownLine,
      subMenus: [{ name: "Banner", link: "/home/banner/list" }],
    },

    //   {
    //   name: "Leadership",
    //   icon: FiUser,
    //   dropdownIcon: RiArrowDropDownLine,
    //   subMenus: [{ name: "Leadership List", link: "/home/leadership/list" }],
    // },

    {
      name: "Term Condition",
      link: "/home/termCondition",
      icon: IoDocumentTextOutline,
    },
    {
      name: "Privacy Policy",
      link: "/home/privacyPolicy",
      icon: IoDocumentLockOutline,
    },
    // {
    //   name: "AboutUs",
    //   link: "/home/aboutUs",
    //   icon: IoDocumentLockOutline,
    // },
  ];

  const filteredMenus = menus
    .map((menu) => {
      if (!menu.subMenus) return menu;
      const visible = menu.subMenus.filter(
        (s) => !s.sectionName || hasPermission(s.sectionName, "read")
      );
      return visible.length ? { ...menu, subMenus: visible } : null;
    })
    .filter(Boolean);

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (index, subIndex) => {
    setActiveSubMenu(activeSubMenu === subIndex ? null : subIndex);
    setActiveMenu(index);
  };

  return (
    <section className="flex">
      <div className="relative">
        {/* Sidebar */}
        <aside
          className={`bg-gradient-to-b from-blue-700 to-blue-950 h-screen shadow-lg
          ${open ? "w-[260px]" : "w-20"} duration-500 text-white flex flex-col`}
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mt-4 mb-4 px-4">
            <img
              src="/images/appLogo.png"
              className={`rounded-full transition-all duration-500 ${
                open ? "w-28" : "w-10"
              }`}
            />

            <div className="flex justify-center items-center gap-x-10">
              <h1
                className={`mt-3 text-center font-bold text-lg transition-all duration-700
                ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10 hidden"
                }`}
              >
                Bharat Metal Grid
              </h1>

              {/* Toggle Button */}
              <HiMenuAlt3
                size={28}
                className="mt-4 p-1 rounded-full bg-blue-800 cursor-pointer hover:scale-110 hover:bg-blue-900 transition-all duration-200 shadow-lg"
                onClick={() => {
                  setOpen(!open);
                  setActiveMenu(null);
                }}
              />
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 sidebar-scroll overflow-y-auto mt-4 pb-4 px-4">
            {filteredMenus.map((menu, index) => (
              <div key={index}>
                {menu.subMenus ? (
                  <>
                    {/* Menu Row */}
                    <div
                      onClick={() => {
                        if (!open) {
                          if (menu.subMenus && menu.subMenus.length > 0) {
                            setActiveMenu(index);
                            navigate(menu.subMenus[0].link);
                          }
                        } else {
                          handleMenuClick(index);
                        }
                      }}
                      className={`group flex items-center rounded-md cursor-pointer mb-1
                        ${
                          activeMenu === index
                            ? "bg-blue-900 shadow-md"
                            : "hover:bg-blue-800"
                        }
                        ${
                          open
                            ? "p-3 w-full justify-between"
                            : "w-full h-12 justify-center"
                        }`}
                    >
                      <div
                        className={`flex items-center gap-3 ${
                          !open ? "justify-center" : ""
                        }`}
                      >
                        <menu.icon size={20} />
                        <span
                          className={`duration-300 ${
                            open
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-6 hidden"
                          }`}
                        >
                          {menu.name}
                        </span>
                      </div>

                      {open && menu.dropdownIcon && (
                        <menu.dropdownIcon
                          size={22}
                          className={`transition-transform duration-300 
                          ${activeMenu === index ? "rotate-180" : ""}`}
                        />
                      )}

                      {!open && (
                        <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg">
                          {menu.name}
                        </span>
                      )}
                    </div>

                    {/* Submenus */}
                    <div
                      className={`overflow-hidden transition-all duration-300 
                        ${
                          activeMenu === index && open
                            ? "max-h-[500px] mt-1"
                            : "max-h-0"
                        }`}
                    >
                      {menu.subMenus.map((sub, si) => (
                        <Link
                          key={si}
                          to={sub.link}
                          onClick={() => handleSubMenuClick(index, si)}
                          className="block text-sm py-3 pl-12 pr-3 hover:bg-blue-800 rounded-md mb-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={menu.link}
                    onClick={() => setActiveMenu(index)}
                    className={`group flex items-center rounded-md mb-1
                      ${
                        activeMenu === index
                          ? "bg-blue-900 shadow-md"
                          : "hover:bg-blue-800"
                      }
                      ${
                        open
                          ? "p-3 w-full gap-3 justify-start"
                          : "w-full h-12 justify-center"
                      }`}
                  >
                    <menu.icon size={20} />

                    <span
                      className={`duration-300 ${
                        open
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-6 hidden"
                      }`}
                    >
                      {menu.name}
                    </span>

                    {!open && (
                      <span className="absolute left-16 bg-gray-800 text-white px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg">
                        {menu.name}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="w-full"></section>
    </section>
  );
};

export default Sidebar;
