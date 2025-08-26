/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: { dangerouslyAllowSVG: true, remotePatterns: [{ protocol: 'https', hostname: '**' }] }
};
module.exports = nextConfig;
