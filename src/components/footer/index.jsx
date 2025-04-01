import React from "react";
import { Box, Tooltip } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const Footer = ({ handleLogout }) => {
  return (
    <Box className="footer">
      <Tooltip title="Logout" arrow>
        <PowerSettingsNewIcon onClick={handleLogout} />
      </Tooltip>
    </Box>
  );
};

export default Footer;
