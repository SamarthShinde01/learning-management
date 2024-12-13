import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.pexels.com", // Updated hostname
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
