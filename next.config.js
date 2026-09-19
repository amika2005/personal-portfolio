/** @type {import('next').NextConfig} */
const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = (phase) => ({
  output: 'export',
  trailingSlash: true,
  // `next dev` writes to the gitignored .next: dist/ is tracked, and editor/sync watchers on it
  // kept locking freshly written files mid-compile (errno -4094). Builds still export to dist/.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next' : 'dist',
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
});

module.exports = nextConfig;
