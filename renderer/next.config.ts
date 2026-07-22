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
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    browserToTerminal: true,
    incomingRequests: true,
    serverFunctions: true,
  },
};

export default config;
