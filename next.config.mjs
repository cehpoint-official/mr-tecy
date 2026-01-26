/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Use placeholder for missing images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

export default nextConfig
