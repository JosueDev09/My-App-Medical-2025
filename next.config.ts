import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcrypt'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        bcrypt: false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        'nock': false,
      };
    }
    
    // Ignorar módulos problemáticos
    config.externals = config.externals || [];
    config.externals.push({
      'mock-aws-s3': 'mock-aws-s3',
      'aws-sdk': 'aws-sdk',
      'nock': 'nock',
      'node-gyp': 'node-gyp',
    });
    
    // Ignorar archivos HTML de node-pre-gyp
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/source',
    });
    
    return config;
  },
};

export default nextConfig;
