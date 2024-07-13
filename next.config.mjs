/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', 'files.stripe.com']
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: false,
};

export default nextConfig;
