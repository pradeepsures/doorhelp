import React, { useEffect, useState } from "react";
import Loader from "../../compoents/Loader";
import DOMPurify from "dompurify";
import { getAdminInfo } from "../../Services/TermConditionApi";

const TermConditionEditor = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAdminInfo();

      if (result.success) {
        setContent(result.data.payload.termAndConditions);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex p-4">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Terms & Conditions
        </h1>

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

export default TermConditionEditor;

