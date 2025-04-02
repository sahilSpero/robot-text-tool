import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// src/app/layout.jsx
import { Providers } from "../redux/Provider"; // You will create this
import ThemeRegistry from "@/ThemeRegistry/Index";
import theme from "../theme";
import Toast from "../components/toast";
import "@fontsource/poppins";
import AppBarComponent from "@/components/appBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Robots.txt Validator & Testing Tool | Free Robots.txt Checker',
  description: 'Just enter your domain to test and validate your robots.txt file. Get instant notifications if your website’s robots.txt file is changed unintentionally.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default function RootLayout({ children }) {
  console.log("testing layout");
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeRegistry>
            <AppBarComponent />
            {children}
            <Toast />
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
