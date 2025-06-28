/** @type {import('next').NextConfig} */
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack(config: WebpackConfig) {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;


