import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, IconButton, Divider, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getBannerById } from "../../Services/bannerService";
import { formatDateTime } from "../../utils/dateFormatter";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const BannerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await getBannerById(id);
      setBanner(res.data);
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to load banner details");
      navigate("/home/banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "800px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/home/banners")} sx={{ mr: 2 }}>
          <MdArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Banner Details
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : banner ? (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              {banner.title}
            </Typography>
            
            <Chip 
              label={banner.status ? "Active" : "Inactive"} 
              color={banner.status ? "success" : "default"} 
              sx={{ mb: 3 }}
            />
            
            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#555" }}>
              Banner Images ({banner.images?.length || 0})
            </Typography>
            {banner.images && banner.images.length > 0 ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 3, mb: 3 }}>
                {banner.images.map((img, index) => (
                  <Box key={index} sx={{ border: "1px solid #eee", borderRadius: "8px", overflow: "hidden", height: "200px" }}>
                    <img 
                      src={`${BASE_URL}${img}`} 
                      alt={`${banner.title} ${index + 1}`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: "#f9f9f9" }} 
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ mb: 3 }}>No images available</Typography>
            )}
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDateTime(banner.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {formatDateTime(banner.updatedAt)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="error">Banner not found</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default BannerView;
