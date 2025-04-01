// src/components/ThemeRegistry.jsx (make a new file)

'use client';

import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
