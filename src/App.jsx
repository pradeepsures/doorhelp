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
import IndustryNewsList from "./Pages/industryNews/IndustryNewsList";
import IndustryNewsView from "./Pages/industryNews/IndustryNewsDetails";
import IndustryNewsCreate from "./Pages/industryNews/IndustryNewsCreate";
import LatestNoticesList from "./Pages/LatestNotice/LatestNoticeList";
import LatestNoticesView from "./Pages/LatestNotice/LatestNoticesDetails";
import LatestNoticeCreate from "./Pages/LatestNotice/LatestNoticeCreate";
import IndustryNewsEdit from "./Pages/industryNews/IndustryNewsUpdate";
import LatestNoticeUpdate from "./Pages/LatestNotice/LatestNoticeUpdate";
import AssociationsList from "./Pages/Association/AssociationList";
import MembersList from "./Pages/Member/MemberList";
import AssociationDetails from "./Pages/Association/AssociationDetails";
import CreateAssociation from "./Pages/Association/AssociationCreate";
import MemberDetailsPage from "./Pages/Member/MemberDetails";
import CreateMember from "./Pages/Member/MemberCreate";
import UpdateAssociation from "./Pages/Association/AssociationUpdate";
import EditMember from "./Pages/Member/MemberUpdate";

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
        { path: "create", element: <IndustryNewsCreate /> },
        { path: "view/:id", element: <IndustryNewsView /> },
      { path:"edit/:id", element:<IndustryNewsEdit />  },
      ],
    },

    {
  path: "latest-notices",
  children: [
    { path: "list", element: <LatestNoticesList /> },
    { path: "view/:id", element: <LatestNoticesView /> },
    { path: "create", element: <LatestNoticeCreate /> },
    { path:"edit/:id", element:<LatestNoticeUpdate /> }
  ],
},

{
  path: "association",
  children: [
       { path: "list", element: <AssociationsList /> },
    { path : "create", element: <CreateAssociation /> },     
    { path : "view/:id", element: <AssociationDetails /> },
    { path : "edit/:id", element: <UpdateAssociation /> }, 
  ]
},

{
  path: "members",
  children: [
    { path: "list", element: <MembersList /> }, 
    { path: "view/:id", element: <MemberDetailsPage /> },
    { path : "create", element: <CreateMember /> },
    { path : "edit/:id", element: <EditMember />  },
  ]
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
