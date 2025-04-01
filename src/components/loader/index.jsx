import React from "react";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div style={styles.loaderContainer}>
      <CircularProgress sx={{ color: "#f13624" }} />
    </div>
  );
};

const styles = {
  loaderContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
};

export default Loader;
