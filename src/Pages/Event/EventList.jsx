// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getEventList,
//   deleteEvent,
// } from "../../Services/event";
// import {
//   FiEdit,
//   FiEye,
//   FiTrash2,
//   FiMoreVertical,
//   FiPlus,
//   FiSearch,
// } from "react-icons/fi";
// import { toast } from "react-hot-toast";

// const FILE_BASE_URL = "http://159.89.146.245:7007";

// export default function EventList() {
//   const navigate = useNavigate();

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [totalPage, setTotalPage] = useState(1);
//   const limit = 7;

//   const [openMenuId, setOpenMenuId] = useState(null);
//   const menuRefs = useRef({});

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const res = await getEventList({ page, limit });

//       setEvents(res.data || []);
//       setTotalPage(res.totalPage || 1);
//     } catch (err) {
//       toast.error("Failed to load events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, [page]);

//   // ✅ Frontend Search (Title)
//   const filteredEvents = events.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   // Close menu outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         openMenuId &&
//         !menuRefs.current[openMenuId]?.contains(event.target)
//       ) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [openMenuId]);

//   const toggleMenu = (id) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this event?"))
//       return;

//     try {
//       await deleteEvent(id);
//       toast.success("Event deleted successfully");
//       setOpenMenuId(null);
//       fetchEvents();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">Events</h1>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <div className="relative flex-1 min-w-[280px]">
//             <input
//               type="text"
//               placeholder="Search by title..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
//             />
//             <FiSearch
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               size={18}
//             />
//           </div>

//           <button
//             onClick={() => navigate("/home/event/create")}
//             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow font-medium"
//           >
//             <FiPlus size={18} /> Add Event
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
//         {loading ? (
//           <div className="flex justify-center py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : filteredEvents.length === 0 ? (
//           <div className="text-center py-16 text-gray-500">
//             <p className="text-xl font-medium">No events found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">

//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-20">
//                     Sr No
//                   </th>
//                   <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-65">
//                     IMAGES
//                   </th>
//                   <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-50">
//                     TITLE
//                   </th>
//                     <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold">
//                     START TIME
//                   </th>
//                     <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold">
//                     END TIME
//                   </th>
//                   <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold">
//                     DATE
//                   </th>
//                   <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold text-right">
//                     ACTIONS
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {filteredEvents.map((item, index) => {
//                   const serialNo =
//                     (page - 1) * limit + index + 1;

//                   return (
//                     <tr key={item._id} className="hover:bg-gray-50">

//                       {/* Sr No */}
//                       <td className="px-6 py-4 text-sm">
//                         {serialNo}
//                       </td>

//                       {/* ✅ Images (Show Only 3) */}
//                       <td className="px-6 py-4">
//                         {item.images?.length > 0 ? (
//                           <div className="flex gap-3">
//                             {item.images.slice(0, 3).map((img, index) => (
//                               <div key={index} className="relative">
//                                 <img
//                                   src={`${FILE_BASE_URL}/${img}`}
//                                   alt={item.title}
//                                   className="h-16 w-16 object-cover rounded-md border shadow"
//                                 />

//                                 {/* Badge */}
//                                 {index === 2 &&
//                                   item.images.length > 3 && (
//                                     <span className="absolute inset-0 bg-black/60 text-white text-xs flex items-center justify-center rounded-md">
//                                       +{item.images.length - 3}
//                                     </span>
//                                   )}
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="h-16 w-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded-md">
//                             No Image
//                           </div>
//                         )}
//                       </td>

//                       {/* Title */}
//                       <td className="px-6 py-4 text-sm font-semibold">
//                         {item.title}
//                       </td>

//                         {/* start time */}
//                       <td className="px-6 py-4 text-sm font-semibold">
//                         {item.startTime}
//                       </td>

//                           {/* end time */}
//                       <td className="px-6 py-4 text-sm font-semibold">
//                         {item.endTime}
//                       </td>

//                       {/* Date */}
//                       <td className="px-6 py-4 text-sm">
//                         {new Date(item.date).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4 text-right relative">
//                         <div
//                           ref={(el) =>
//                             (menuRefs.current[item._id] = el)
//                           }
//                         >
//                           <button
//                             onClick={() => toggleMenu(item._id)}
//                             className="p-2 rounded-full hover:bg-gray-100"
//                           >
//                             <FiMoreVertical size={20} />
//                           </button>

//                           {openMenuId === item._id && (
//                             <ul className="absolute right-0 mt-1 w-44 bg-white border rounded-lg shadow-xl z-50 py-1 text-sm">

//                               <li>
//                                 <button
//                                   onClick={() =>
//                                     navigate(`/home/event/view/${item._id}`)
//                                   }
//                                   className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-blue-700"
//                                 >
//                                   <FiEye size={16} /> View
//                                 </button>
//                               </li>

//                               <li>
//                                 <button
//                                   onClick={() =>
//                                     navigate(`/home/event/edit/${item._id}`)
//                                   }
//                                   className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-green-700"
//                                 >
//                                   <FiEdit size={16} /> Edit
//                                 </button>
//                               </li>

//                               <li>
//                                 <button
//                                   onClick={() =>
//                                     handleDelete(item._id)
//                                   }
//                                   className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-700"
//                                 >
//                                   <FiTrash2 size={16} /> Delete
//                                 </button>
//                               </li>

//                             </ul>
//                           )}
//                         </div>
//                       </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && totalPage > 1 && (
//           <div className="px-6 py-4 flex justify-between items-center border-t bg-gray-50">
//             <div className="text-sm text-gray-600">
//               Page {page} of {totalPage}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() =>
//                   setPage((p) => Math.max(1, p - 1))
//                 }
//                 disabled={page === 1}
//                 className="px-4 py-2 border rounded-lg disabled:opacity-50"
//               >
//                 Previous
//               </button>

//               <button
//                 onClick={() =>
//                   setPage((p) =>
//                     Math.min(totalPage, p + 1)
//                   )
//                 }
//                 disabled={page === totalPage}
//                 className="px-4 py-2 border rounded-lg disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEventList,
  deleteEvent,
} from "../../Services/event";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const FILE_BASE_URL = "http://159.89.146.245:7007";

export default function EventList() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const limit = 7;

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEventList({ page, limit });

      setEvents(res.data || []);
      setTotalPage(res.totalPage || 1);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  // Frontend Search (Title)
  const filteredEvents = events.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        !menuRefs.current[openMenuId]?.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?"))
      return;

    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully");
      setOpenMenuId(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <button
            onClick={() => navigate("/home/event/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow font-medium"
          >
            <FiPlus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl font-medium">No events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">

              <thead>
                <tr>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-20 text-left">
                    Sr No
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-64 text-left">
                    IMAGES
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-80 text-left">
                    TITLE
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-44 text-left">
                    START TIME
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-44 text-left">
                    END TIME
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-40 text-left">
                    DATE
                  </th>
                  <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold text-right pr-10">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredEvents.map((item, index) => {
                  const serialNo = (page - 1) * limit + index + 1;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">

                      {/* Sr No */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {serialNo}
                      </td>

                      {/* Images - show max 3 + badge */}
                      <td className="px-6 py-4">
                        {item.images?.length > 0 ? (
                          <div className="flex gap-3">
                            {item.images.slice(0, 3).map((img, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={`${FILE_BASE_URL}/${img}`}
                                  alt={item.title}
                                  className="h-16 w-16 object-cover rounded-md border shadow-sm"
                                />
                                {idx === 2 && item.images.length > 3 && (
                                  <span className="absolute inset-0 bg-black/60 text-white text-xs font-medium flex items-center justify-center rounded-md">
                                    +{item.images.length - 3}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-16 w-24 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-md border">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.title}
                      </td>

                      {/* Start Time */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.startTime || "—"}
                      </td>

                      {/* End Time */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.endTime || "—"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right relative">
                        <div
                          ref={(el) => (menuRefs.current[item._id] = el)}
                          className="inline-block"
                        >
                          <button
                            onClick={() => toggleMenu(item._id)}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                          >
                            <FiMoreVertical size={20} className="text-gray-600" />
                          </button>

                          {openMenuId === item._id && (
                            <ul className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm">
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(`/home/event/view/${item._id}`)
                                  }
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                  <FiEye size={16} /> View
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(`/home/event/edit/${item._id}`)
                                  }
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-green-600 hover:text-green-800"
                                >
                                  <FiEdit size={16} /> Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 size={16} /> Delete
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPage > 1 && (
          <div className="px-6 py-4 flex justify-between items-center border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPage}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page === totalPage}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}