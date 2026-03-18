// import React, { useEffect, useState } from "react";
// import Loader from "../../compoents/Loader";
// import DOMPurify from "dompurify";
// import { getAdminInfo } from "../../Services/TermConditionApi";

// const TermConditionEditor = () => {
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ✅ Fetch Data
//   const fetchAdminData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const result = await getAdminInfo();

//       if (result.success) {
//         setContent(result.data.payload.termAndConditions);
//       } else {
//         setError("Failed to fetch data");
//       }
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdminData();
//   }, []);

//   if (loading) return <Loader />;

//   return (
//     <div className="flex p-4">
//       <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Terms & Conditions
//         </h1>

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

// export default TermConditionEditor;



import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

import { getAdminInfo, updateTerms } from "../../Services/TermConditionApi";

const ADMIN_ID = "698064f87234456b88576678";

const TermConditionEditor = () => {
  const [content, setContent] = useState("");
  const [tempContent, setTempContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      const res = await getAdminInfo();
      const terms = res?.data?.payload?.termAndConditions || "";

      setContent(terms);
      setTempContent(terms);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Update
  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateTerms(ADMIN_ID, tempContent);
      setContent(tempContent);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Cancel Edit
  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  return (
    <div className="p-6 w-full">
      <div className="bg-white rounded-xl shadow p-6 w-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>

        {/* ERROR */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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

export default TermConditionEditor;