import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getLocalityById, createLocality, updateLocality } from "../../Services/localityService";

const LocalityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchLocalityDetails = async () => {
        setLoading(true);
        try {
          const res = await getLocalityById(id);
          if (res.success) {
            setName(res.data.name);
            setStatus(res.data.status || "active");
          } else {
            toast.error(res.message || "Failed to load locality details");
            navigate("/home/locality");
          }
        } catch (err) {
          toast.error("Failed to fetch locality details");
          navigate("/home/locality");
        } finally {
          setLoading(false);
        }
      };

      fetchLocalityDetails();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Locality name is required");
    }

    setSubmitting(true);
    const payload = { name, status };
    try {
      const res = isEdit
        ? await updateLocality(id, payload)
        : await createLocality(payload);

      if (res.success) {
        toast.success(`Locality ${isEdit ? "updated" : "created"} successfully`);
        navigate("/home/locality");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-screen flex justify-center items-center">
        Loading locality details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Locality" : "Add Locality"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? "Modify serviced locality name and status" : "Create a new serviced locality"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Locality Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Connaught Place"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0D877F] text-sm text-gray-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/home/locality"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0D877F] text-white text-sm font-medium rounded-lg hover:bg-[#0b6f69] transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Locality"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocalityForm;
