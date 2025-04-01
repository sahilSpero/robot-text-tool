"use client";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import Img from "/a23";
import { useState } from "react";
import DropDown from "../dropDown/Index";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import graphImg from '@/../public/assets/arrow-upper-right.png';

const drawerWidth = 240;

// console.log(Img, )

const AppBarComponent = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [marketingHover, setMarketingHover] = useState(false);
  const [developmentHover, setDevelopmentHover] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDashboard, setIsDashboard] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScheduleCall = () => {
    window.location.href = "https://www.webspero.com/schedule-call/";
  };
  const handleLogoClick = () => {
    window.location.href = "https://www.webspero.com/";
  };
  const isRobotToolDashboard = () => {
    if (typeof window === "undefined") return false;
    return window.location.href.includes("/dashboard");
  };


  useEffect(() => {
    setIsDashboard(isRobotToolDashboard());
  }, []);
  
  const handleLogout = () => {
    dispatch(authAction.logOut());
  };


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Add Domain" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }} onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = typeof window !== "undefined" ? () => window.document.body : undefined;


  return (
    <Box className="nav-con">
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1)",
          padding: "0 5%",
        }}
        className="appBar"
      >
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            className="logo-container"
            sx={{
              flexGrow: 1,
              display : "flex",
            }}
          >
            <img src={'/assets/webspero.webp'} alt="logo" onClick={handleLogoClick} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#000",
                textTransform: "capitalize",
                marginLeft: "10px",
                marginRight: "10px",
              }}
              className="logo-text"
              display={{ xs: "none", sm: "block" }}
            >
               <img  src={graphImg}/>
              Get Our SEO Experts Help You Grow Your Business
            </Typography>
            <Typography></Typography>
          </Typography>
          <Box
            sx={{
              display:  "flex" ,
              alignItems: "center",
              gap: 2,
            }}
            className="appBar-button-container"
          >
            {/* <Button
              onMouseEnter={() => setMarketingHover(true)}
              onMouseLeave={() => setMarketingHover(false)}
              sx={{
                color: "#000",
                textTransform: "inherit",
                fontWeight: 600,
                fontSize: "16px !important",
                marginRight: 2,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Marketing
              <KeyboardArrowDownIcon />
            </Button> */}

            {/* <Button
              onMouseEnter={() => setDevelopmentHover(true)}
              onMouseLeave={() => setDevelopmentHover(false)}
              sx={{
                color: "#000",
                textTransform: "inherit",
                fontWeight: 600,
                fontSize: "16px !important",
                marginRight: 2,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Development
              <KeyboardArrowDownIcon />
            </Button> */}

            {/* <Button
              id="about-button"
              aria-controls={open ? "about-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={() => setAboutHover(true)}
              onMouseEnter={() => setAboutHover(true)}
              onMouseLeave={() => setAboutHover(false)}
              sx={{
                color: "#000",
                textTransform: "inherit",
                fontWeight: 600,
                fontSize: "16px !important",
                marginRight: 2,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                position: "relative",
              }}
            >
              About Us
              <KeyboardArrowDownIcon />
            {aboutHover && <DropDown setHover={setAboutHover} type="About" />}
            </Button> */}
            {/* <Button
              sx={{
                color: "#000",
                textTransform: "inherit",
                fontWeight: 600,
                fontSize: "16px !important",
                marginRight: 2,
              }}
            >
              Testimonials
            </Button> */}

            <Button
              onClick={handleScheduleCall}
              sx={{
                backgroundColor: "#f13624",
                color: "#fff",
                border: "2px solid #f13624",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#f13624",
                  border: "2px solid #f13624",
                },
                "&:focus": {
                  outline: "none",
                },
                transition: "all 0.3s ease",
                textTransform: "inherit",
                fontWeight: 600,
                fontSize: "16px !important",
                borderRadius: "5px",
                padding: "6px 14px",
                minWidth: "120px",
              }}
            >
              Schedule a Call
            </Button>

            {isDashboard && (
              <Button
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#f13624",
                  color: "#fff",
                  border: "2px solid #f13624",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#f13624",
                    border: "2px solid #f13624",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  transition: "all 0.3s ease",
                  textTransform: "inherit",
                  fontWeight: 600,
                  fontSize: "16px !important",
                  borderRadius: "5px",
                  padding: "6px 14px",
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
        {/* {marketingHover && (
          <DropDown setHover={setMarketingHover} type="marketing" />
        )}
        {developmentHover && (
          <DropDown setHover={setDevelopmentHover} type="development" />
        )} */}
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, pb: 0 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

AppBarComponent.propTypes = {
  window: PropTypes.func,
  handleLogout: PropTypes.func.isRequired,
};

export default AppBarComponent;
