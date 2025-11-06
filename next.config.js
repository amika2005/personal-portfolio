/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@app': path.resolve(__dirname, './app'),
    };
    return config;
  },
};

module.exports = nextConfig;
