import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript:{
        ignoreBuildErrors: true
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
