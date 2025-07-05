import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
// import RouteGuard from "../../middleware";
import ProgressBar from "./Components/ProgressBar";
import { ThemeProvider } from "./context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // <== this enables .variable
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lekhan &ndash; Write, Read, and Share Blogs",
  description: "Lekhan is a modern blogging platform where writers share ideas, readers explore stories, and communities connect over meaningful content. Start writing today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
    <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        >
          <ProgressBar />
          <Header />
          {children}
        </body>
    </html>
    </ThemeProvider>
  );
}
