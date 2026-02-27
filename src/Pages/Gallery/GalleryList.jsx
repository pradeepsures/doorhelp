import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    getGalleryList,
    deleteGallery,
} from "../../Services/gallery";
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

export default function GalleryList() {
    const navigate = useNavigate();

    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPage, setTotalPage] = useState(1);
    const limit = 7;

    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const res = await getGalleryList({ page, limit });
            setGallery(res.data || []);
            setTotalPage(res.totalPage || 1);
        } catch (err) {
            toast.error("Failed to load gallery");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [page]);

    // Frontend Search
    const filteredGallery = gallery.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown outside click
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
        if (!window.confirm("Are you sure you want to delete this gallery item?"))
            return;

        try {
            await deleteGallery(id);
            toast.success("Gallery deleted successfully");
            setOpenMenuId(null);
            fetchGallery();
        } catch {
            toast.error("Failed to delete gallery");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>

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
                        onClick={() => navigate("/home/gallery/create")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow font-medium"
                    >
                        <FiPlus size={18} /> Add Gallery
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">
                            Loading gallery items...
                        </p>
                    </div>
                ) : filteredGallery.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-6xl mb-4">🖼️</div>
                        <p className="text-xl font-medium">No gallery items found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-24">
                                        Sr No
                                    </th>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-110">
                                        IMAGES
                                    </th>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-60">
                                        TITLE
                                    </th>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-45">
                                        CREATED AT
                                    </th>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-45">
                                        STATUS
                                    </th>
                                    <th className="px-6 py-3 bg-primary-gradient text-white text-sm font-bold w-30 text-right">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {filteredGallery.map((item, index) => {
                                    const serialNo =
                                        (page - 1) * limit + index + 1;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            {/* Sr No */}
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {serialNo}
                                            </td>

                                            {/* Image */}
                                            <td className="px-6 py-4">
                                                {item.images?.length > 0 ? (
                                                    <div className="flex gap-4">
                                                        {item.images.slice(0, 5).map((img, index) => (
                                                            <div key={index} className="relative">
                                                                <img
                                                                    src={`${FILE_BASE_URL}/${img}`}
                                                                    alt={item.title}
                                                                    className="h-16 w-16 object-cover rounded-md border border-white shadow"
                                                                />

                                                                {/* Show badge on 5th image if more exist */}
                                                                {index === 4 && item.images.length > 5 && (
                                                                    <span className="absolute inset-0 bg-black/60 text-white text-xs flex items-center justify-center rounded-md">
                                                                        +{item.images.length - 5}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-16 w-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded-md border">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>


                                            {/* Title */}
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {item.title}
                                            </td>

                                            {/* createdAt */}
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {new Date(item.createdAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-medium ${item.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right relative">
                                                <div
                                                    ref={(el) =>
                                                        (menuRefs.current[item._id] = el)
                                                    }
                                                >
                                                    <button
                                                        onClick={() => toggleMenu(item._id)}
                                                        className="p-2 rounded-full hover:bg-gray-100"
                                                    >
                                                        <FiMoreVertical size={20} />
                                                    </button>

                                                    {openMenuId === item._id && (
                                                        <ul className="absolute right-0 mt-1 w-44 bg-white border rounded-lg shadow-xl z-50 py-1 text-sm">
                                                            <li>
                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/home/gallery/view/${item._id}`
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-blue-700"
                                                                >
                                                                    <FiEye size={16} /> View
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/home/gallery/edit/${item._id}`
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-green-700"
                                                                >
                                                                    <FiEdit size={16} /> Edit
                                                                </button>
                                                            </li>
                                                        
                                                            <li>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(item._id)
                                                                    }
                                                                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-700"
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
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(totalPage, p + 1)
                                    )
                                }
                                disabled={page === totalPage}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
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