/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "bn", "id"],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.siamrtx.space',
      },
      {
        protocol: 'https',
        hostname: 'devapi.siamrtx.space',
      },
      {
        protocol: 'https',
        hostname: 'testapi.siamrtx.space',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;