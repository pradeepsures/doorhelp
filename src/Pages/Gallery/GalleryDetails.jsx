// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getGalleryById } from "../../Services/gallery";
// import { toast } from "react-hot-toast";
// import { FiDownload, FiArrowLeft } from "react-icons/fi";

// const FILE_BASE_URL = "http://159.89.146.245:7007";

// export default function ViewGallery() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [gallery, setGallery] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await getGalleryById(id);
//       setGallery(res.data);
//     } catch (err) {
//       toast.error("Failed to load gallery details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading gallery details...</p>
//       </div>
//     );
//   }

//   if (!gallery) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         Gallery not found
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate("/home/gallery")}
//             className="flex items-center gap-2 text-indigo-600 font-medium"
//           >
//             <FiArrowLeft /> Back
//           </button>

//           <span
//             className={`px-3 py-1 text-xs rounded-full font-medium ${
//               gallery.isActive
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {gallery.isActive ? "Active" : "Inactive"}
//           </span>
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-8">
//           {gallery.title}
//         </h2>

//         {/* Images */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Images
//           </h3>

//           {gallery.images?.length > 0 ? (
//             <div className="flex flex-wrap gap-4">
//               {gallery.images.map((img, index) => {
//                 const imageUrl = `${FILE_BASE_URL}/${img}`;

//                 return (
//                   <div key={index} className="relative group">
                    
//                     {/* Click to open new tab */}
//                     <a
//                       href={imageUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={`gallery-${index}`}
//                         className="h-24 w-24 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
//                       />
//                     </a>

//                     {/* Download Button */}
//                     <a
//                       href={imageUrl}
//                       download
//                       className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
//                       title="Download Image"
//                     >
//                       <FiDownload size={14} />
//                     </a>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-500">No images available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGalleryById } from "../../Services/gallery";
import { toast } from "react-hot-toast";
import { FiDownload, FiArrowLeft } from "react-icons/fi";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function ViewGallery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Gallery Details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getGalleryById(id);
      setGallery(res.data);
    } catch (err) {
      toast.error("Failed to load gallery details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // 🔥 Force Image Download (WORKING METHOD)
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop(); // Extract file name
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading gallery details...
        </p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="p-10 text-center text-gray-500">
        Gallery not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">

        {/* Header */}
       
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/home/gallery/list")}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
          >
            <FiArrowLeft /> Back  
          </button>

          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              gallery.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {gallery.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Title 
          <p className="text-xl text-blue-700">{gallery.title}</p>
        </h2>

        {/* Images Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Images
          </h3>

          {gallery.images?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {gallery.images.map((img, index) => {
                const imageUrl = `${FILE_BASE_URL}/${img}`;

                return (
                  <div
                    key={index}
                    className="relative group"
                  >
                    {/* Open in new tab */}
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={imageUrl}
                        alt={`gallery-${index}`}
                        className="h-24 w-24 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
                      />
                    </a>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(imageUrl)}
                      className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 opacity-90"
                      title="Download Image"
                    >
                      <FiDownload size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No images available</p>
          )}
        </div>

      </div>
    </div>
  );
}