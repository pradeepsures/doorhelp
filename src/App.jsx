import React from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./Pages/Dashborad/Dashboard";
import Login from "./loginpage/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";
import CmsEditor from "./Pages/CMS/CmsEditor";
import BannerList from "./Pages/Banners/BannerList";
import BannerForm from "./Pages/Banners/BannerForm";
import BannerView from "./Pages/Banners/BannerView";
import CategoryList from "./Pages/Category/CategoryList";
import CategoryForm from "./Pages/Category/CategoryForm";
import CategoryView from "./Pages/Category/CategoryView";
import SubcategoryList from "./Pages/Subcategory/SubcategoryList";
import SubcategoryForm from "./Pages/Subcategory/SubcategoryForm";
import SubcategoryView from "./Pages/Subcategory/SubcategoryView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cms/:page", element: <CmsEditor /> },
      { path: "banners", element: <BannerList /> },
      { path: "banners/create", element: <BannerForm /> },
      { path: "banners/edit/:id", element: <BannerForm /> },
      { path: "banners/view/:id", element: <BannerView /> },
      { path: "category", element: <CategoryList /> },
      { path: "category/create", element: <CategoryForm /> },
      { path: "category/edit/:id", element: <CategoryForm /> },
      { path: "category/view/:id", element: <CategoryView /> },
      { path: "subcategory", element: <SubcategoryList /> },
      { path: "subcategory/create", element: <SubcategoryForm /> },
      { path: "subcategory/edit/:id", element: <SubcategoryForm /> },
      { path: "subcategory/view/:id", element: <SubcategoryView /> },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
