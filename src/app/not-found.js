"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Box, Typography } from "@mui/material";


export default function NotFound() {
  return (
    <div className="page-not-found-container">
      {/* Header */}
      {/* Illustration */}
      <Box className="illustration">
        {/* <Image src="/robot-404.png" width={300} height={300} alt="404 Error" /> */}
      </Box>

      {/* Error Text */}
      <Typography className="error-message">Oops! Page Not Found</Typography>
      <Typography className="description">  
        The page you are looking for does not exist or has been moved.
      </Typography>

      {/* Button */}
      <Link href="/">
        <Button className="button">Go Back Home</Button>
      </Link>
    </div>
  );
}
