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
        hostname: 'api.nakhlah.xyz',
      },
      {
        protocol: 'https',
        hostname: 'devapi.nakhlah.xyz',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;
