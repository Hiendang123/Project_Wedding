/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // 🏴‍☠️ Fix SSR issues with browser-only APIs - GenG style!
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 🎯 Mock browser-only APIs on server - GenG approved!
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // 🏴‍☠️ Handle client-side only modules - GenG style!
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        "indexeddb-js": "indexeddb-js",
        "fake-indexeddb": "fake-indexeddb",
      });
    }

    return config;
  },
};

module.exports = nextConfig;
