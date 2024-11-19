import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
  devIndicators: {
    appIsrStatus: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/core/note',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
