import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Paper, CircularProgress, 
  FormControlLabel, Switch, IconButton 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getBannerById, createBanner, updateBanner } from "../../Services/bannerService";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const BannerForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    status: true,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchBanner();
    }
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await getBannerById(id);
      const banner = res.data;
      setFormData({
        title: banner.title,
        status: banner.status,
      });
      if (banner.images && banner.images.length > 0) {
        setImagePreviews(banner.images.map(img => `${BASE_URL}${img}`));
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to load banner details");
      navigate("/home/banners");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
      
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!isEditMode && images.length === 0) {
      toast.error("At least one image is required to create a banner");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("status", formData.status);
    
    images.forEach((img) => {
      payload.append("images", img);
    });

    try {
      setSaving(true);
      if (isEditMode) {
        await updateBanner(id, payload);
        toast.success("Banner updated successfully");
      } else {
        await createBanner(payload);
        toast.success("Banner created successfully");
      }
      navigate("/home/banners");
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "800px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/home/banners")} sx={{ mr: 2 }}>
          <MdArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          {isEditMode ? "Edit Banner" : "Add New Banner"}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Banner Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Banner Images {isEditMode ? "(Optional - upload to replace all existing images)" : "*"}
              </Typography>
              {imagePreviews.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <img 
                      key={index}
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: '8px', border: '1px solid #ddd' }} 
                    />
                  ))}
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch 
                  checked={formData.status} 
                  onChange={handleChange} 
                  name="status" 
                  color="primary" 
                />
              }
              label="Active Status"
              sx={{ mt: 2, mb: 4 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate("/home/banners")}
                sx={{ borderColor: "#061B38", color: "#061B38" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                variant="contained"
                sx={{
                  backgroundColor: "#061B38",
                  color: "white",
                  px: 4,
                  "&:hover": { backgroundColor: "#00113A" },
                }}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Update Banner" : "Create Banner")}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default BannerForm;
