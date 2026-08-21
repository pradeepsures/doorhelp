import React, { useState, useEffect } from "react";
import { getPublicCmsContent } from "../../Services/cmsService";

const AboutUsPublic = () => {
  const activeType = "user"; // Hardcoded to default user content

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAboutUs = async (aboutType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicCmsContent(aboutType, "about");
      setContent(res.data?.content || "<p class='text-gray-500 italic'>No information defined yet.</p>");
    } catch (err) {
      console.error(err);
      setError("Failed to load About Us details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs(activeType);
  }, [activeType]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-4 md:p-8 flex justify-center">
      {/* Content Container */}
      <div className="w-full max-w-4xl min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Fetching details...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => fetchAboutUs(activeType)}
              className="mt-4 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex-1 prose prose-slate max-w-none">
            <div
              className="ql-editor !p-0 font-normal leading-relaxed text-slate-700 space-y-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsPublic;
