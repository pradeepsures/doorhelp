import { Outlet } from "react-router-dom";
import Siderbar from "../compoents/Siderbar";
import Navbar from "../compoents/Navbar";
// import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Siderbar></Siderbar>
      <div className="flex flex-col flex-1">
        <Navbar></Navbar>
        <main className="p-4 flex-1 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
