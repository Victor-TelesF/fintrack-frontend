/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            // Content Security Policy suitable for a SPA that talks to an external API
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; " +
                `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} https://*.vercel-insights.com; ` +
                "img-src 'self' data:; " +
                "style-src 'self' 'unsafe-inline'; " +
                "font-src 'self' data:; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com; " +
                "object-src 'none'; frame-ancestors 'none';",
            },
        ],
      },
    ]
  },
}

export default nextConfig
