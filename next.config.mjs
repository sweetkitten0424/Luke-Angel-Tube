import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Initialize the Cloudflare development platform bindings locally
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js doesn't try to use optimized server images unsuited for edge nodes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
