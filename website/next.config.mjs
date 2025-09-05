/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  redirects: async () => {
    return [
      {
        source: '/:package',
        destination: '/:package/intro',
        permanent: true,
      },
    ]
  },
})
