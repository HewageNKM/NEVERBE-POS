import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        unoptimized: true,
        remotePatterns: [{
            hostname: 'storage.googleapis.com',
        }]
    }
};

export default nextConfig;
