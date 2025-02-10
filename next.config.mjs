/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['yourdomain.com'], // Add if using external images
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/_next/static/images',
                        outputPath: 'static/images',
                        name: '[name].[hash].[ext]',
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
