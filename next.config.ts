import type {NextConfig} from "next";
const webpack = require('webpack');

const nextConfig: NextConfig = {
    /* config options here */
    typescript:{
        ignoreBuildErrors: true
    },
    webpack(config, { isServer }) {
        // Ignore `fs` and `net` modules in the browser environment
        if (!isServer) {
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^fs$|^net$/,
                })
            );
        }

        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [{
            hostname: 'storage.googleapis.com',
        }]
    }
};

export default nextConfig;
