import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    FORCE_MOCK_API: process.env.FORCE_MOCK_API,
    STORYBOOK: process.env.STORYBOOK,
  },
  // Docker ビルド時はLintとTypeCheckをスキップ
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_BUILD_LINT === 'true',
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_BUILD_LINT === 'true',
  },
};

export default nextConfig;
