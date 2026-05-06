import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
    ],
  },
};

export default config;
