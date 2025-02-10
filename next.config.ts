import type { NextConfig } from "next";
import dynamic from "next/dynamic";

const nextConfig: NextConfig = {
  experimental: {staleTimestamps:{dynamic:30,}},
  /* config options here */
};

export default nextConfig;
