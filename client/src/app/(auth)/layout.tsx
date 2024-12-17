const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full bg-customgreys-primarybg">
			<div className="w-full flex h-full justify-center items-center">
				{children}
			</div>
		</div>
	);
};

export default Layout;
