/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["files.insforge.com", "lh3.googleusercontent.com"], // Common domains for GastroGuide
  },
};

export default nextConfig;
