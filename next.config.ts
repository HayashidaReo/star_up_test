import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    FORCE_MOCK_API: process.env.FORCE_MOCK_API,
    STORYBOOK: process.env.STORYBOOK,
  },
};

export default nextConfig;
