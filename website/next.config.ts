/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

import getAllPackages from './src/utils/getAllPackages'

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  redirects: async () => {
    const packages = await getAllPackages()

    return packages.map((packageName) => ({
      source: `/${packageName}`,
      destination: `/${packageName}/overview`,
      permanent: true,
    }))
  },
})
