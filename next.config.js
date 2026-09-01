/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Static files under public/ are served at their literal path, so
  // public/collapse/index.html would only answer /collapse/index.html.
  // This maps the clean URL onto it explicitly rather than relying on the
  // host to infer a directory index.
  async rewrites() {
    return [
      { source: '/collapse', destination: '/collapse/index.html' },
      { source: '/collapse/demo', destination: '/collapse/demo/index.html' },
    ]
  },
}

module.exports = nextConfig
