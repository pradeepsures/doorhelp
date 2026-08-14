import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import profileFallback from "../../src/profilelogo.png";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";
import { formatStatus } from "../utils/stringFormatter";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProfileView = () => {
  const { auth, logout } = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      if (profileImage) {
        payload.append("profileImage", profileImage);
      }
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
           setError("Passwords do not match");
           setLoading(false);
           return;
        }
        payload.append("password", formData.newPassword);
      }

      const response = await axiosInstance.put(`/api/v1/admin/auth/profile`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully");
      
      // Update local storage and context manually, or trigger a re-fetch
      // For simplicity, we just reload the page or update local storage directly here
      // if the backend returns the updated admin object:
      if (response.data?.data) {
        const updatedAdmin = response.data.data;
        localStorage.setItem("user", JSON.stringify(updatedAdmin));
        // A full reload will re-initialize the context with new local storage data
        setTimeout(() => window.location.reload(), 1000);
      }
      
      setShowEditForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log("base_url", BASE_URL);
  const displayImage = user?.profileImage ? `${BASE_URL}${user.profileImage}` : profileFallback;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 5,
        p: { xs: 2, sm: 3 },
        bgcolor: "background.default",
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "visible",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            background: "#061B38",
            height: 100,
            borderRadius: "16px 16px 0 0",
            position: "relative",
          }}
        >
          <Avatar
            src={displayImage}
            alt={user.userName}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              position: "absolute",
              bottom: -60,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "background.paper",
            }}
          />
        </Box>
        <CardContent sx={{ pt: 10, pb: 4 }}>
          {user.name && (
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {formatStatus(user.name)}
            </Typography>
          )}
          {user.email && (
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {user.email}
            </Typography>
          )}
          {user.createdAt && (
            <Typography variant="body2" align="center" color="text.secondary">
              Joined on: {formatDate(user.createdAt)}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setShowEditForm(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "medium",
                px: 3,
                py: 1,
                borderColor: "#061B38",
                color: "#061B38",
                "&:hover": {
                  backgroundColor: "#061B3810",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {showEditForm && (
        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Edit Profile
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Profile Image
                </Typography>
                {imagePreview && (
                  <Box sx={{ mb: 2 }}>
                    <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100, borderRadius: '8px', objectFit: 'cover' }} />
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "block", width: "100%" }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                    backgroundColor: "#061B38",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#00113A",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setShowEditForm(false)}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                    borderColor: "#061B38",
                    color: "#061B38",
                    "&:hover": {
                      backgroundColor: "#061B3820",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileView;
