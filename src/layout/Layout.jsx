import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Siderbar from "../compoents/Siderbar";
import Navbar from "../compoents/Navbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar overlay backdrop on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Siderbar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 flex-1 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
