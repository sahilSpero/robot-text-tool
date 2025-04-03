import { Box, Typography, Container, Grid, Divider } from "@mui/material";
import React from "react";
import { footerData } from "../../utils";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer1 = () => {
  return (
    <Box
      sx={{ backgroundColor: "#fff", py: 4 }}
      width={"100%"}
      className="footer-container"
    >
      <Container
        sx={{ width: "calc(80% - 10px)", maxWidth: "1540px !important", margin: "0 auto" }}
        className="footer-container-inner"
        
      >
        <Grid 
          container 
          spacing={3} 
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          {footerData.map((item) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={2.3}
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
              className="footer-item"
            >
              <Box sx={{ 
                textAlign: 'left',
                maxWidth: '400px',
                width: '100%'
              }}>
                {/* Icon/Image */}
                <img
                  src={item.img.src}
                  alt={`${item.id} office`}
                  style={{
                    height: "90px",
                    width: "76px",
                  }}
                />
                {console.log(item, "item")}

                {/* Location Name */}
                <Typography variant="h5" sx={{ mb: "14px" , mt : "9px"}}>
                  {item.name}
                </Typography>

                {/* Address */}
                <Box className="footer-address">
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "16px"}} maxWidth={"200px"} minWidth={item.id === 2 ? "220px" : "0"}>
                  {item.location}
                </Typography>

                {/* Phone Numbers */}
                {item.id === 5 ? (
                  // For India office with multiple numbers
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 , margin : "30px 0 10px 0"}}>
                      <PhoneIcon
                        sx={{ color: "#ff4d4d", mr: 1, fontSize: "20px" }}
                      />
                      <Typography variant="body2" color="#ff4d4d" fontSize={"16px"}  fontWeight={500}>
                        Sales: {item.phoneNumber.sales}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon
                        sx={{ color: "#ff4d4d", mr: 1, fontSize: "20px" }}
                      />
                      <Typography variant="body2" color="#ff4d4d" fontSize={"16px"}  fontWeight={500}>
                        HR: {item.phoneNumber.hr}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  // For other offices with single number
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      sx={{ color: "#ff4d4d", mr: 1, fontSize: "20px" }}
                    />
                    <Typography variant="body2" color="#ff4d4d" fontSize={"16px"}  fontWeight={500}>
                      {item.phoneNumber}
                    </Typography>
                  </Box>
                )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" align="center" color="#33333" sx={{ fontSize: "18px" }}>
          © Copyright 2025. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer1;
