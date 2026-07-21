import { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: "./",
  },
  typedRoutes: true,
  compress: true,
};

export default config;
