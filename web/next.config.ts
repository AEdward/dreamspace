import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const strapiHost = new URL(strapiUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiHost.protocol.replace(":", "") as "http" | "https",
        hostname: strapiHost.hostname,
        port: strapiHost.port,
        pathname: "/uploads/**",
      },
    ],
    // Opt-in only: needed while the Strapi CMS runs on localhost during
    // local development. In production it's a real public hostname, so
    // this should stay unset there.
    dangerouslyAllowLocalIP: process.env.ALLOW_LOCAL_CMS_IMAGES === "true",
  },
};

export default nextConfig;
