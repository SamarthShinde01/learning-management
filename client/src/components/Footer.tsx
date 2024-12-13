import Link from "next/link";

const Footer = () => {
	const date = new Date();
	return (
		<div className="bg-customgreys-secondarybg bottom-0 w-full py-8 mt-10 text-center text-sm">
			<p>&copy; {date.getFullYear()} Samarth Shinde. All Rights Reserved.</p>

			<div className="mt-2">
				{["About", "Privacy Policy", "Licencing", "Contact"].map((item) => (
					<Link
						key={item}
						href={`/${item.toLowerCase().replace(" ", "-")}`}
						className="text-primary-500 mx-2"
					>
						{item}
					</Link>
				))}
			</div>
		</div>
	);
};

export default Footer;
