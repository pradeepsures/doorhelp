import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import { updateUserApi, getUserByIdApi } from "../../Services/UserApi";

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    city: "",
    state: "",
    gender: "",
    status: true,
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserByIdApi(id);
        if (res.status && res.data) {
          const user = res.data;
          setFormData({
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            countryCode: user.countryCode || "+91",
            city: user.city || "",
            state: user.state || "",
            gender: user.gender || "",
            status: user.status !== undefined ? user.status : true,
            profileImage: null,
          });
          if (user.profileImage) {
            setImagePreview(
              `${import.meta.env.VITE_BASE_URL}/${user.profileImage}`
            );
          }
        } else {
          toast.error(res.message || "Failed to fetch user data");
        }
      } catch (error) {
        toast.error(error.message || "Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(files[0]);
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!formData.name) errors.name = "Name is required.";
    if (!formData.mobile) errors.mobile = "Mobile number is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (formData.status === "") errors.status = "Status is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      const res = await updateUserApi({ id, data: dataToSend });
      if (res.status) {
        toast.success("User updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to update user");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="">
      <div className="bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label className="ml-2 mt-4 font-normal block">Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="User Name"
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* Email */}
          <label className="ml-2 mt-4 font-normal block">Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="email"
            placeholder="User Email"
          />
          {apiError.email && (
            <p className="text-red-500 text-sm ml-2">{apiError.email}</p>
          )}

          {/* Mobile */}
          <label className="ml-2 mt-4 font-normal block">Mobile:</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Mobile Number"
          />
          {apiError.mobile && (
            <p className="text-red-500 text-sm ml-2">{apiError.mobile}</p>
          )}

          {/* Country Code */}
          <label className="ml-2 mt-4 font-normal block">Country Code:</label>
          <input
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Country Code (e.g., +91)"
          />
          {apiError.countryCode && (
            <p className="text-red-500 text-sm ml-2">{apiError.countryCode}</p>
          )}

          {/* City */}
          <label className="ml-2 mt-4 font-normal block">City:</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="City"
          />
          {apiError.city && (
            <p className="text-red-500 text-sm ml-2">{apiError.city}</p>
          )}

          {/* State */}
          <label className="ml-2 mt-4 font-normal block">State:</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="State"
          />
          {apiError.state && (
            <p className="text-red-500 text-sm ml-2">{apiError.state}</p>
          )}

          {/* Gender */}
          <label className="ml-2 mt-4 font-normal block">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {apiError.gender && (
            <p className="text-red-500 text-sm ml-2">{apiError.gender}</p>
          )}

          {/* Status */}
          <label className="ml-2 mt-4 font-normal block">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
          >
            <option value="">Select Status</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
          {apiError.status && (
            <p className="text-red-500 text-sm ml-2">{apiError.status}</p>
          )}

          {/* Profile Image Upload */}
          <div className="flex justify-between">
            <label className="ml-2 mt-4 font-normal block">
              Profile Image (1440x650):
            </label>
            <label className="ml-2 mt-4 font-normal block">
              Image Format (JPEG, PNG, GIF, SVG)
            </label>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-24 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
            />
          )}
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload Image
          </label>
          <input
            id="image-upload"
            className="hidden"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {apiError.profileImage && (
            <p className="text-red-500 text-sm ml-2">{apiError.profileImage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
