/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/metadata/:tokenId.json",
        destination: "/api/metadata/:tokenId",
      },
      {
        source: "/api/image/:hash.png",
        destination: "/api/image/:hash",
      },
    ];
  },
};

module.exports = nextConfig;
