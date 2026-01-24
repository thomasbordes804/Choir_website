import type { NextConfig } from "next";
import { sanityConfig } from "@/lib/sanity/config"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: `/images/${sanityConfig.projectId}/production/**`,
      },
    ],
  },
};

export default nextConfig;
