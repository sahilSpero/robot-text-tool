import { Box, Typography } from "@mui/material";
import React from "react";

const LeftContent = ({ scrollToRef }) => {
  const items = [
    {
      id: 1,
      text: "Protect Your Website Traffic – Monitor Robots.txt Changes Instantly!",
      ref: "content-box1"
    },
    { id: 2, text: "Why Robots.txt Monitoring Matters.", ref: "content-box2" },
    { id: 3, text: "How to Use the Robot.txt Validator.", ref: "content-box3" },
    { id: 4, text: "Features and Benefits of Our Free Robots.txt Checker.", ref: "content-box4" },
    { id: 5, text: "Frequently Asked Questions (FAQs).", ref: "content-box5" },
  ];
  return (
    <Box className="left-container" maxWidth={"30%"}>
      <Box className="left-con-inner">
      <Typography variant="h2" my={"24px"} fontSize={"24px"}>
        Table Of Content
      </Typography>
      <Box className="headings-con">
        <ul>
          {items.map((item) => (
            <li key={item.id} onClick={() => scrollToRef(item.ref)}>{item.text}</li>
          ))}
        </ul>
      </Box>
      </Box>
    </Box>
  );
};

export default LeftContent;
