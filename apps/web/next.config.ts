import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Linting is handled by the workspace ESLint config via Turborepo.
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@blackcinnamon/contracts',
    '@blackcinnamon/design-tokens',
    '@blackcinnamon/validation',
  ],
};

export default nextConfig;
