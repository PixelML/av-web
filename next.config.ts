import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/skill.md",
        destination:
          "https://raw.githubusercontent.com/PixelML/av/main/skills/agentic-video-memory/SKILL.md",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
