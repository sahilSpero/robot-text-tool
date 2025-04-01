import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const dropdownData = {
  marketing: [
    {
      title: "SEO SERVICES",
      items: [
        "Local SEO Agency",
        "Generative Engine Optimization",
        "E-commerce SEO Agency",
        "Link Building Services",
        "Media Outreach Solutions",
        "CRO Agency",
        "Enterprise SEO Services",
        "White Label SEO Services",
      ],
    },
    {
      title: "DIGITAL ADVERTISING",
      items: [
        "YouTube Ads Agency",
        "Amazon Ads Agency",
        "Google Ads Agency",
        "LinkedIn Ads Agency",
      ],
    },
    {
      title: "CONTENT WRITING",
      items: [
        "Article Writing Services",
        "Web Copywriting",
        "Press Release Writing Services",
        "Landing Page Writing Services",
      ],
    },
    {
      title: "REQUEST FREE CONSULTATION",
      items: ["Name", "Email", "Enter Phone No.", "Website URL"],
    },
  ],
  development: [
    {
      title: "WEB DEVELOPMENT",
      items: [
        "Saas Development",
        "MVP Development Services",
        "Gen AI Development Services",
        "MERN Stack Development",
        "NodeJs Development",
        "Blockchain Development",
        "Python Development",
        "Shopify Development",
        "Laravel Development",
      ],
    },
    {
      title: "MOBILE DEVELOPMENT",
      items: [
        "Hybrid App Development",
        "Android App Development",
        "iPhone Applications Development",
        "React Native Development",
      ],
    },
    {
      title: "AI DEVELOPMENT",
      items: [
        "Generative AI Development",
        "Generative AI Consulting",
        "Generative AI Integration",
        "ChatGPT Integration Service",
        "AI Chatbot Development",
        "Open AI API Integrations",
        "LLM Development",
      ],
    },
    {
      title: "HIRE DEVELOPERS",
      items: [
        "Hire Gen AI Developers",
        "Hire Open AI Experts",
        "Hire Blockchain Developers",
        "Hire full-stack Developers",
        "Hire Expert Node.js Developers",
        "Hire Shopify Plus Experts",
        "Hire iOS Developers",
        "Hire React Native Developer",
        "Hire Laravel Developers",
      ],
    },
  ],
  About: [
     "Work",
     "Career",
     "Our Award"
  ]
};

const DropDown = ({ setHover, type }) => {
  const data = dropdownData[type];

  if (!data) return null;

  if (type === "marketing") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "89px",
          left: 0,
          width: "100%",
          backgroundColor: "#ffff",
          color: "#333",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px 80px",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {data.map((section, index) => (
          <Box
            key={index}
            sx={{
              width: "20%",
              backgroundColor: "#fff8e1",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {section.title}
            </Typography>
            <Divider
              sx={{ mb: 2, backgroundColor: "#f13624", height: "2px" }}
            />
            {section.items.map((item, itemIndex) => (
              <Typography
                key={itemIndex}
                sx={{ mb: itemIndex !== section.items.length - 1 ? 1 : 0 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    );
  }
  if (type === "development") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "89px",
          left: 0,
          width: "100%",
          backgroundColor: "#ffff",
          color: "#333",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px 80px",
        }}
        onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
      >
        {data.map((section, index) => (
          <Box
            key={index}
            sx={{
              width: "20%",
              backgroundColor: "#fff8e1",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {section.title}
            </Typography>
            <Divider
              sx={{ mb: 2, backgroundColor: "#f13624", height: "2px" }}
            />
            {section.items.map((item, itemIndex) => (
              <Typography
                key={itemIndex}
                sx={{ mb: itemIndex !== section.items.length - 1 ? 1 : 0 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  if (type === "About") {
    return (
        <Box
        sx={{
          position: "absolute",
          top: "40px",
          left: "0px",
        //   width: "100%",
          backgroundColor: "#ffff",
          color: "#333",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px 80px",
        }}
        onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
      > 
       {data.map((section, index) => (
        <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <Typography>{section}</Typography>
        </Box>
      ))}
      </Box>
    );
  }
};

export default DropDown;
