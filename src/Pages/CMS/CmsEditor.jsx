import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getCmsContent, updateCmsContent } from "../../Services/cmsService";
import { Box, Typography, Button, CircularProgress, Tabs, Tab, Card, CardContent } from "@mui/material";
import toast from "react-hot-toast";

const CmsEditor = () => {
  const { page } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = ["admin", "user", "vendor"];
  const currentType = tabs[tabIndex];

  // Helper to format the page title nicely
  const getPageTitle = (pageParam) => {
    switch (pageParam) {
      case "privacy_policy":
        return "Privacy Policy";
      case "terms_and_conditions":
        return "Terms and Conditions";
      case "about":
        return "About Us";
      default:
        return "CMS Editor";
    }
  };

  const fetchContent = async (type, pageName) => {
    try {
      setLoading(true);
      const res = await getCmsContent(type, pageName);
      setContent(res.data?.content || "");
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page) {
      fetchContent(currentType, page);
    }
  }, [page, currentType]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateCmsContent(currentType, page, content);
      toast.success(`${getPageTitle(page)} updated successfully for ${currentType}!`);
    } catch (error) {
      console.error("Error updating CMS:", error);
      toast.error(error.response?.data?.message || "Failed to update CMS content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#333" }}>
         {getPageTitle(page)}
      </Typography>

      <Card sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
        >
          <Tab label="Admin" sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }} />
          <Tab label="User" sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }} />
          <Tab label="Vendor" sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }} />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "500", color: "#555" }}>
                 {getPageTitle(page)} for <strong style={{textTransform: "capitalize"}}>{currentType}</strong>
              </Typography>
              
              <Box sx={{ '.ql-editor': { minHeight: '300px', fontSize: '1rem' } }}>
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  placeholder={`Write the ${getPageTitle(page)} here...`}
                />
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleUpdate}
                  disabled={saving}
                  variant="contained"
                  sx={{
                    backgroundColor: "#061B38",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 14px 0 rgba(6, 27, 56, 0.39)",
                    "&:hover": {
                      backgroundColor: "#00113A",
                      boxShadow: "0 6px 20px rgba(6, 27, 56, 0.23)",
                    },
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : "Update Content"}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CmsEditor;
