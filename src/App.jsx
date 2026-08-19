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
import IncludedServiceManager from "./Pages/Subcategory/IncludedServiceManager";
import UserList from "./Pages/User/UserList";
import UserView from "./Pages/User/UserView";
import VendorList from "./Pages/Vendor/VendorList";
import VendorView from "./Pages/Vendor/VendorView";
import BookingList from "./Pages/Booking/BookingList";
import BookingView from "./Pages/Booking/BookingView";
import PincodeList from "./Pages/Pincode/PincodeList";
import PincodeForm from "./Pages/Pincode/PincodeForm";
import LocalityList from "./Pages/Locality/LocalityList";
import LocalityForm from "./Pages/Locality/LocalityForm";
import CouponList from "./Pages/Coupon/CouponList";
import CouponForm from "./Pages/Coupon/CouponForm";
import CouponView from "./Pages/Coupon/CouponView";
import PlatformFeeList from "./Pages/PlatformFee/PlatformFeeList";
import PlatformFeeForm from "./Pages/PlatformFee/PlatformFeeForm";
import PlatformFeeView from "./Pages/PlatformFee/PlatformFeeView";

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
      { path: "subcategory/:subCategoryId/included-services", element: <IncludedServiceManager /> },
      { path: "user", element: <UserList /> },
      { path: "user/view/:id", element: <UserView /> },
      { path: "vendor", element: <VendorList /> },
      { path: "vendor/view/:id", element: <VendorView /> },
      { path: "booking", element: <BookingList /> },
      { path: "booking/view/:id", element: <BookingView /> },
      { path: "pincode", element: <PincodeList /> },
      { path: "pincode/create", element: <PincodeForm /> },
      { path: "pincode/edit/:id", element: <PincodeForm /> },
      { path: "locality", element: <LocalityList /> },
      { path: "locality/create", element: <LocalityForm /> },
      { path: "locality/edit/:id", element: <LocalityForm /> },
      { path: "coupon", element: <CouponList /> },
      { path: "coupon/create", element: <CouponForm /> },
      { path: "coupon/edit/:id", element: <CouponForm /> },
      { path: "coupon/view/:id", element: <CouponView /> },
      { path: "platform-fee", element: <PlatformFeeList /> },
      { path: "platform-fee/create", element: <PlatformFeeForm /> },
      { path: "platform-fee/edit/:id", element: <PlatformFeeForm /> },
      { path: "platform-fee/view/:id", element: <PlatformFeeView /> },
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
