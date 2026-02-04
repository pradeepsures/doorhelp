import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  Chip,
  Pagination,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import xlsx from "json-as-xlsx";
import { motion } from "framer-motion";
import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import { getUserLogsApi } from "../../Services/UserApi";

export default function UserLog() {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUserLogsApi({ page, rowsPerPage, searchQuery });
      if (result?.status) {
        const transformed = (result.data || []).map((item) => ({
          id: item._id,
          userId: item.user?._id,
          userName: item.user?.name,
          userEmail: item.user?.email,
          userMobile: item.user?.mobile,
          updatedBy: item.updatedBy?.name || item.updatedBy?.email || "N/A",
          updatedAt: item.updatedAt
            ? new Date(item.updatedAt).toLocaleString()
            : "N/A",
        }));
        setData(transformed);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch user logs");
      }
    } catch (err) {
      console.error("Error fetching user logs:", err);
      toast.error("Error fetching user logs");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handlePageChange = (e, newPage) => setPage(newPage);

  const exportFunc = async (allLogsData) => {
    if (!allLogsData.length) return toast.error("User logs list is empty!");
    setIsExporting(true);
    const settings = {
      fileName: "User_Logs",
      writeMode: "writeFile",
    };
    const excelData = [
      {
        sheet: "User Logs",
        columns: [
          { label: "Log ID", value: "id" },
          { label: "User Name", value: "userName" },
          { label: "Email", value: "userEmail" },
          { label: "Mobile", value: "userMobile" },
          { label: "Updated By", value: "updatedBy" },
          { label: "Updated At", value: "updatedAt" },
        ],
        content: allLogsData,
      },
    ];
    try {
      xlsx(excelData, settings);
      toast.success("User logs exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export user logs");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Breaker />

      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchQuery(search);
            setPage(1);
          }}
        >
          <div className="flex items-center gap-3">
            <TextField
              size="small"
              placeholder="Search user logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 bg-white"
            />
            <Button
              variant="contained"
              onClick={() => {
                setSearchQuery(search);
                setPage(1);
              }}
              sx={{
                background: "linear-gradient(to right, #45d85e, #1F4926)",
                "&:hover": {
                  background: "linear-gradient(to right, #3cc752, #1a3b20)",
                },
              }}
            >
              Search
            </Button>
          </div>
        </form>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            disabled={isExporting}
            onClick={() => exportFunc(data)}
            sx={{
              background: "linear-gradient(to right, #45d85e, #1F4926)",
              "&:hover": {
                background: "linear-gradient(to right, #3cc752, #1a3b20)",
              },
            }}
          >
            {isExporting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Export Excel"
            )}
          </Button>
        </motion.div>
      </div>

      {/* MUI Table */}
      <TableContainer
        component={Paper}
        className="shadow-md rounded-xl"
        data-aos="fade-up"
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{ background: "linear-gradient(to right, #45d85e, #1F4926)" }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                S.No
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Mobile
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Updated By
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Updated Date
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No user logs found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9fafb" },
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.userName || "N/A"}</TableCell>
                  <TableCell>{row.userEmail || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.userMobile || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{row.updatedBy}</TableCell>
                  <TableCell>{row.updatedAt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, row.userId)}
                      aria-label="actions"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu (Floating Above Table) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            mt: -2,
            zIndex: 9999,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(`UserLogView/${selectedRowId}`);
            handleMenuClose();
          }}
        >
          <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
          View
        </MenuItem>
      </Menu>

      {/* Pagination */}
      {totalRecord > rowsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      )}
    </div>
  );
}
