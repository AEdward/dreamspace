import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app deploys on a cPanel/CloudLinux (LVE) host with a low
  // per-account process limit. Next's build spawns extra worker
  // processes by default, which trips that limit (EAGAIN). Force
  // everything onto a single process instead.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
