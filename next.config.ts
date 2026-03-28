/** @type {import('next').NextConfig} */
import type { Configuration as WebpackConfig } from "webpack";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/lekhan" : "",
  assetPrefix: isProd ? "/lekhan" : "",
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "blogs-backend-ftie.onrender.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ This disables type-checking during build
  },
  webpack(config: WebpackConfig) {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
