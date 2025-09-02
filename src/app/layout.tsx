import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
import ProgressBar from "./Components/ProgressBar";
// import { ThemeProvider } from "./context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  title: "Lekhan – Write, Read, and Share Blogs",
  description:
    "Lekhan is a modern blogging platform where writers share ideas, readers explore stories, and communities connect over meaningful content. Start writing today!",
  alternates: {
    canonical: "https://lekhan-blogs.vercel.app/", // 👈 update if your final domain is different
  },
  icons: {
    icon: "/favicon.png", // 👈 make sure you have this in /public
  },
  openGraph: {
    title: "Lekhan – Write, Read, and Share Blogs",
    description:
      "A modern blogging platform where writers share ideas, readers explore stories, and communities connect over meaningful content.",
    url: "https://lekhan-blogs.vercel.app/",
    siteName: "Lekhan",
    images: [
      {
        url: "https://lekhan-blogs.vercel.app/og-image.png", // 👈 put og-image.png in /public
        width: 1200,
        height: 630,
        alt: "Lekhan Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lekhan – Write, Read, and Share Blogs",
    description:
      "Share your voice, explore stories, and connect with communities on Lekhan.",
    images: ["https://lekhan.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ThemeProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ProgressBar />
        <Header />
        <main>{children}</main>
      </body>
    </html>
    // </ThemeProvider>
  );
}
