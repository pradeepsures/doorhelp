import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard, MdOutlineArticle, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GiVerticalBanner } from "react-icons/gi";
import { MdHomeRepairService } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(0);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  const toggleSubmenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const menus = [
    { name: "Dashboard", link: "/home", icon: MdOutlineDashboard },
    { name: "Banners", link: "/home/banners", icon: GiVerticalBanner },
    {
      name: "Services",
      icon: MdHomeRepairService,
      submenus: [
        { name: "Category", link: "/home/category" },
        { name: "Sub Category", link: "/home/subcategory" },
      ],
    },
    {
      name: "CMS",
      icon: MdOutlineArticle,
      submenus: [
        { name: "Privacy Policy", link: "/home/cms/privacy_policy" },
        { name: "Terms and Condition", link: "/home/cms/terms_and_conditions" },
        { name: "About Us", link: "/home/cms/about" },
      ],
    },
  ];

  return (
    <section className="flex">
      <div className="relative">
        {/* Sidebar */}
        <aside
          className={`bg-theme-gradient-vertical h-screen shadow-lg
          ${open ? "w-[260px]" : "w-20"} duration-500 text-white flex flex-col`}
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mt-4 mb-4 px-4">
            <img
              src="/images/doorhelpLogo.png"
              className={`rounded-full transition-all duration-500 mr-6 ${
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
                DoorHelp
              </h1>

              {/* Toggle Button */}
              <HiMenuAlt3
                size={28}
                className="mt-4 p-1 rounded-full bg-[#0D877F] cursor-pointer hover:scale-110 hover:opacity-90 transition-all duration-200 shadow-lg"
                onClick={() => {
                  setOpen(!open);
                }}
              />
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 sidebar-scroll overflow-y-auto mt-4 pb-4 px-4">
            {menus.map((menu, index) => (
              <div key={index}>
                {menu.submenus ? (
                  <div
                    className="group flex flex-col mb-1"
                  >
                    <div 
                      onClick={() => toggleSubmenu(index)}
                      className={`flex items-center cursor-pointer rounded-md transition-colors ${
                        open ? 'p-3 gap-3' : 'h-12 justify-center'
                      } ${
                        activeMenu === index && !activeSubMenu
                          ? "bg-[#0D877F] shadow-md"
                          : "hover:bg-[#0D877F]/50"
                      }`}
                    >
                      <menu.icon size={20} />
                      <span
                        className={`duration-300 flex-1 ${
                          open
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-6 hidden"
                        }`}
                      >
                        {menu.name}
                      </span>
                      {open && (
                        openMenus[index] ? (
                          <MdKeyboardArrowUp size={24} />
                        ) : (
                          <MdKeyboardArrowDown size={24} />
                        )
                      )}
                    </div>
                    
                    {/* Submenus */}
                    {open && openMenus[index] && (
                      <div className="flex flex-col pl-12 pr-3 pb-3 space-y-3">
                        {menu.submenus.map((sub, sIndex) => (
                          <Link
                            key={sIndex}
                            to={sub.link}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(index);
                              setActiveSubMenu(sub.link);
                            }}
                            className={`text-sm transition-colors p-2 rounded-md block ${
                              activeSubMenu === sub.link
                                ? "bg-[#0D877F] shadow-md text-white font-bold"
                                : "text-white hover:bg-[#0D877F]/50"
                            }`}
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={menu.link}
                    onClick={() => {
                      setActiveMenu(index);
                      setActiveSubMenu(null);
                      setOpenMenus({});
                    }}
                    className={`group flex items-center rounded-md mb-1
                      ${
                        activeMenu === index
                          ? "bg-[#0D877F] shadow-md"
                          : "hover:bg-[#0D877F]/50"
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
