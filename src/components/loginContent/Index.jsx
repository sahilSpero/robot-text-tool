import React, { useRef } from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { Box } from "@mui/material";

const LoginContent = () => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);
  const box5Ref = useRef(null);

  const scrollToRef = (ref) => {
    console.log("clicking")
    if (ref === "content-box1") {
      box1Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (ref === "content-box2") {
      box2Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (ref === "content-box3") {
      box3Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (ref === "content-box4") {
      box4Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (ref === "content-box5") {
      box5Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
  <>
  <Box className="content-container" display={"flex"}  justifyContent={"space-between"} gap={"100px"} width={"100%"}>
  <LeftContent  scrollToRef={scrollToRef} />
  <RightContent box1Ref={box1Ref} box2Ref={box2Ref} box3Ref={box3Ref} box4Ref={box4Ref} box5Ref={box5Ref} />
  </Box>
  </>
  );
};

export default LoginContent;
