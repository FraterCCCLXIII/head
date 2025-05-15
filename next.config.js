/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['framer-motion'],
  output: 'export',
  distDir: 'out',
};

module.exports = nextConfig;