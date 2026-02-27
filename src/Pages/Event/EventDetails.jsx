// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getEventById } from "../../Services/event";
// import { toast } from "react-hot-toast";
// import { FiDownload, FiArrowLeft } from "react-icons/fi";

// const FILE_BASE_URL = "http://159.89.146.245:7007";

// export default function ViewEvent() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch Event Details
//   const fetchDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await getEventById(id);
//       setEvent(res.data);
//     } catch (err) {
//       toast.error("Failed to load event details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [id]);

//   // 🔥 Download Image (Blob method)
//   const handleDownload = async (url) => {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Download failed");

//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = url.split("/").pop();
//       document.body.appendChild(link);
//       link.click();

//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       toast.error("Failed to download image");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
//         <p className="mt-4 text-gray-600 font-medium">
//           Loading event details...
//         </p>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         Event not found
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate("/home/event/list")}
//             className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
//           >
//             <FiArrowLeft /> Back
//           </button>
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           {event.title}
//         </h2>

//         {/* Description */}
//         <p className="text-gray-600 mb-6">
//           {event.description}
//         </p>

//         {/* Date */}
//         <div className="mb-6">
//           <span className="font-semibold text-gray-700">
//             Event Date:
//           </span>{" "}
//           {new Date(event.date).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "long",
//             year: "numeric",
//           })}
//         </div>

//         {/* Images */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Event Images
//           </h3>

//           {event.images?.length > 0 ? (
//             <div className="flex flex-wrap gap-4">
//               {event.images.map((img, index) => {
//                 const imageUrl = `${FILE_BASE_URL}/${img}`;

//                 return (
//                   <div key={index} className="relative group">

//                     {/* Preview in new tab */}
//                     <a
//                       href={imageUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={`event-${index}`}
//                         className="h-28 w-28 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
//                       />
//                     </a>

//                     {/* Download Button */}
//                     <button
//                       onClick={() => handleDownload(imageUrl)}
//                       className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 opacity-90"
//                       title="Download Image"
//                     >
//                       <FiDownload size={14} />
//                     </button>

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
import { getEventById } from "../../Services/event";
import { toast } from "react-hot-toast";
import { FiDownload, FiArrowLeft } from "react-icons/fi";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function ViewEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Event Details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getEventById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Download Image
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop();
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
          Loading event details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-10 text-center text-gray-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/home/event/list")}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
          >
            <FiArrowLeft /> Back
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Event Details
          </h1>
        </div>

        {/* Title */}
          {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">
            Title
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {event.title}
          </p>
        </div>
        {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {event.title}
        </h2> */}

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Date Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">
              Event Date
            </h3>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Start Time */}
          <div>
            <h3 className="font-semibold text-gray-700">
              Start Time
            </h3>
            <p className="text-gray-600">
            {event.startTime}
            </p>
          </div>

             {/* end Time */}
          <div>
            <h3 className="font-semibold text-gray-700">
              End Time
            </h3>
            <p className="text-gray-600">
            {event.endTime}
            </p>
          </div>

         

          <div>
            <h3 className="font-semibold text-gray-700">
              Created At
            </h3>
            <p className="text-gray-600">
              {new Date(event.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Event Images
          </h3>

          {event.images?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {event.images.map((img, index) => {
                const imageUrl = `${FILE_BASE_URL}/${img}`;

                return (
                  <div key={index} className="relative group">

                    {/* Preview */}
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={imageUrl}
                        alt={`event-${index}`}
                        className="h-28 w-28 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
                      />
                    </a>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(imageUrl)}
                      className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
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