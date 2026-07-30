import type { NextConfig } from 'next';

/* Static export, deployed to Cloudflare Pages from out/.
   trailingSlash keeps every route a directory index, which is what Pages serves cleanly.
   images.unoptimized because this stack uses plain <img>, never next/image. */
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
