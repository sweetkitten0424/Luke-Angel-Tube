/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Safe setting for pulling thumbnail graphics from external urls
  },
  // If you ever want to completely ignore TypeScript/Lint errors during quick deployments, you can uncomment these lines:
  // typescript: { ignoreBuildErrors: true },
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
