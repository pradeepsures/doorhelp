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
import TermConditionList from "./Pages/TermCondition/TermConditionList";
import PrivacyPolicy from "./Pages/privacyPolicy/PrivacyPolicy";
import UserList from "./Pages/User/UserList";
import CreateUser from "./Pages/User/CreateUser";
import UpdateUser from "./Pages/User/UpdateUser";
import UserLog from "./Pages/User/UserLog";
import ViewUserLog from "./Pages/User/ViewUserLog";
import IndustryNewsList from "./Pages/industryNews/getIndustryNewsList";
// import UserList from "./Pages/User/UserList";

// import PageNotFond from "./Pages/notFound/PageNotFond";

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

         {
      path: "industryNews",
      children: [
        { path: "list", element: <IndustryNewsList /> },
        // { path: "view/:id", element: <IndustryNewsView /> },
        // { path: "edit/:id", element: <IndustryNewsEdit /> },
      ],
    },

   
     
      
      //termCondition
      { path: "termCondition", element: <TermConditionList /> },
      { path: "privacyPolicy", element: <PrivacyPolicy /> },
      { path: "*", element: <PageNotFound /> },
      { path: "User", element: <UserList /> },
      { path: "UserLogs", element: <UserLog /> },
      { path: "UserLogs/UserLogView/:id", element: <ViewUserLog /> },
      { path: "User/createUser", element: <CreateUser /> },
      { path: "User/updateUser/:id", element: <UpdateUser /> },
    ],
  },

  // ✅ 404 for any top-level unmatched route like /abc
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
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
