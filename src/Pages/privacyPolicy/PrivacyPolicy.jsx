// import React, { useEffect, useState } from "react";
// import Loader from "../../compoents/Loader";
// import DOMPurify from "dompurify";
// import toast from "react-hot-toast";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const PolicyEditor = () => {
//   const [activeTab, setActiveTab] = useState("privacy");
//   const [data, setData] = useState(null);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");
//   const apiUrl = `${BASE_URL}/api/admin/info`;

//   // ✅ Fetch Data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await res.json();

//       if (result.success) {
//         setData(result.data);

//         // Default Privacy Policy
//         setContent(result.data.payload.privacyPolicy);
//       } else {
//         setError("Failed to fetch data");
//       }
//     } catch (err) {
//       setError("Error fetching data");
//       toast.error("Error fetching data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 🔥 Switch Tabs
//   useEffect(() => {
//     if (!data) return;

//     if (activeTab === "privacy") {
//       setContent(data.payload.privacyPolicy);
//     } else {
//       setContent(data.payload.refundPolicy);
//     }
//   }, [activeTab, data]);

//   if (loading) return <Loader />;

//   return (
//     <div className="flex p-4">
//       <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           {activeTab === "privacy"
//             ? "Privacy Policy"
//             : "Refund Policy"}
//         </h1>

//         {/* Tabs */}
//         <div className="flex space-x-4 mb-6">
//           <button
//             onClick={() => setActiveTab("privacy")}
//             className={`px-4 py-2 rounded ${
//               activeTab === "privacy"
//                 ? "bg-green-500 text-white"
//                 : "bg-gray-200"
//             }`}
//           >
//             Privacy Policy
//           </button>

//           <button
//             onClick={() => setActiveTab("refund")}
//             className={`px-4 py-2 rounded ${
//               activeTab === "refund"
//                 ? "bg-green-500 text-white"
//                 : "bg-gray-200"
//             }`}
//           >
//             Refund Policy
//           </button>
//         </div>

//         {error && <p className="text-red-500">{error}</p>}

//         {content && (
//           <div
//             className="prose max-w-none"
//             dangerouslySetInnerHTML={{
//               __html: DOMPurify.sanitize(content),
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default PolicyEditor;

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";

import { updateAdminPolicy } from "../../Services/TermConditionApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_ID = "698064f87234456b88576678";

const PolicyEditor = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [data, setData] = useState(null);

  const [content, setContent] = useState("");
  const [tempContent, setTempContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        const payload = result.data.payload;
        setData(payload);

        const defaultContent = payload.privacyPolicy || "";
        setContent(defaultContent);
        setTempContent(defaultContent);
      }
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Tab Switch
  useEffect(() => {
    if (!data) return;

    let newContent = "";

    if (activeTab === "privacy") {
      newContent = data.privacyPolicy || "";
    } else if (activeTab === "refund") {
      newContent = data.refundPolicy || "";
    }

    setContent(newContent);
    setTempContent(newContent);
    setIsEditing(false);
  }, [activeTab, data]);

  // ✅ Update
  const handleUpdate = async () => {
    try {
      setSaving(true);

      let payload = {};

      if (activeTab === "privacy") {
        payload = { privacyPolicy: tempContent };
      } else if (activeTab === "refund") {
        payload = { refundPolicy: tempContent };
      }

      await updateAdminPolicy(ADMIN_ID, payload);

      setContent(tempContent);
      setIsEditing(false);

      toast.success("Updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Cancel
  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  return (
    <div className="p-6 w-full">
      <div className="bg-white rounded-xl shadow p-6 w-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === "privacy"
              ? "Privacy Policy"
              : "Refund Policy"}
          </h1>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2 rounded ${
              activeTab === "privacy"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab("refund")}
            className={`px-4 py-2 rounded ${
              activeTab === "refund"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Refund Policy
          </button>
        </div>

        {/* VIEW MODE */}
        {!isEditing && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          />
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <>
            <ReactQuill value={tempContent} onChange={setTempContent} />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PolicyEditor;