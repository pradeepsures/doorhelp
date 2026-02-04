import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProfileView from "./ProfileView"; // Import your profile view component
import profileFallback from "../../src/profilelogo.png"; // Fallback image

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function BasicMenu() {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileOpen = () => {
    setOpenProfile(true);
    handleCloseMenu();
  };

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  const user = auth?.user;
  console.log("user", user);
  const profileImage = user?.profileImage
    ? `${BASE_URL}/${user.profileImage}`
    : profileFallback;
  console.log("profileImage", profileImage);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          sx={{ width: 56, height: 56 }}
          alt={user?.name || "Profile"}
          src={profileImage}
        />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
        {/* <MenuItem onClick={handleCloseMenu}>My account</MenuItem> */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Profile Modal with Close Icon */}
      <Dialog
        open={openProfile}
        onClose={handleProfileClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Admin Profile
          <IconButton
            aria-label="close"
            onClick={handleProfileClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProfileView />
        </DialogContent>
      </Dialog>
    </div>
  );
}
