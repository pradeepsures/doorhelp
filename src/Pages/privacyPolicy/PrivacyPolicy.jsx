// import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Loader from "../../compoents/Loader";
// import toast from "react-hot-toast";
// import { idea } from "react-syntax-highlighter/dist/esm/styles/hljs";
// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const TermConditionEditor = () => {
//   const [type, setType] = useState("pickupboy");
//   const [data, setData] = useState(null);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const id = data?._id;
//   const apiUrl = `${BASE_URL}/api/admin/privacyPolicy?type=${type}`;
//   const apiUrls = `${BASE_URL}/api/admin/privacyPolicy/${id}?type=${type}`;

//   // Fetch term conditions
//   const fetchTermConditions = async () => {
//     const token = localStorage.getItem("token");
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const result = await response.json();
//       if (result.status) {
//         setData(result.data);
//         setContent(result.data.privacyPolicy);
//       } else {
//         setError(result.message || "Failed to fetch term conditions");
//       }
//     } catch (err) {
//       setError("Error fetching data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update term conditions
//   const updateTermConditions = async () => {
//     const token = localStorage.getItem("token");
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const response = await fetch(apiUrls, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ privacyPolicy: content, type }),
//       });
//       const result = await response.json();
//       if (result.status) {
//         // setSuccess("Term conditions updated successfully");
//         toast.success(result.message);
//         setData(result.data);
//       } else {
//         setError(result.message || "Failed to update term conditions");
//       }
//     } catch (err) {
//       setError("Error updating data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data when type changes
//   useEffect(() => {
//     fetchTermConditions();
//   }, [type]);
//   if (loading) return <Loader />;
//   return (
//     <div className="  flex  p-4">
//       <div className="max-w-9xl w-full bg-white rounded-lg shadow-xl p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">
//           Privacy Policy
//         </h1>

//         {/* Type Selection Buttons */}
//         <div className="flex space-x-4 mb-4">
//           <button
//             onClick={() => setType("pickupboy")}
//             className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//               type === "pickupboy"
//                 ? "bg-[#45d85e] text-white"
//                 : "bg-gray-200 text-gray-800 hover:bg-[#45d85e] hover:text-white"
//             }`}
//           >
//             Pickup Boy
//           </button>
//           <button
//             onClick={() => setType("user")}
//             className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//               type === "user"
//                 ? "bg-[#45d85e] text-white"
//                 : "bg-gray-200 text-gray-800 hover:bg-[#45d85e] hover:text-white"
//             }`}
//           >
//             User
//           </button>
//         </div>

//         {/* Loading and Error/Success Messages */}
//         {/* {loading && <p className="text-blue-500">Loading...</p>} */}
//         {error && <p className="text-red-500">{error}</p>}
//         {success && <p className="text-green-500">{success}</p>}

//         {/* Rich Text Editor */}
//         {data && (
//           <div className="mt-4">
//             <ReactQuill
//               theme="snow"
//               value={content}
//               onChange={setContent}
//               className="h-64 mb-10"
//             />
//             <button
//               onClick={updateTermConditions}
//               className="mt-4 px-6 py-2 bg-[#45d85e] text-white rounded-lg font-semibold hover:bg-[#1F4926] transition-colors"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TermConditionEditor;

import React, { useEffect, useState } from "react";
import Loader from "../../compoents/Loader";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PolicyEditor = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [data, setData] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const apiUrl = `${BASE_URL}/api/admin/info`;

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setData(result.data);

        // Default Privacy Policy
        setContent(result.data.payload.privacyPolicy);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data");
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 Switch Tabs
  useEffect(() => {
    if (!data) return;

    if (activeTab === "privacy") {
      setContent(data.payload.privacyPolicy);
    } else {
      setContent(data.payload.refundPolicy);
    }
  }, [activeTab, data]);

  if (loading) return <Loader />;

  return (
    <div className="flex p-4">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {activeTab === "privacy"
            ? "Privacy Policy"
            : "Refund Policy"}
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2 rounded ${
              activeTab === "privacy"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab("refund")}
            className={`px-4 py-2 rounded ${
              activeTab === "refund"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Refund Policy
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {content && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PolicyEditor;

