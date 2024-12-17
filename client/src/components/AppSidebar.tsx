import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubButton,
	useSidebar,
} from "./ui/sidebar";
import {
	BookOpen,
	Briefcase,
	DollarSign,
	LogOut,
	PanelLeft,
	Settings,
	User,
} from "lucide-react";
import Loading from "./Loading";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = () => {
	const { user, isLoaded } = useUser();
	const { signOut } = useClerk();
	const pathname = usePathname();
	const { toggleSidebar } = useSidebar();

	const navLinks = {
		student: [
			{ icon: BookOpen, label: "Courses", href: "/user/courses" },
			{ icon: Briefcase, label: "Billing", href: "/user/billing" },
			{ icon: User, label: "Profile", href: "/user/profile" },
			{ icon: Settings, label: "Settings", href: "/user/settings" },
		],
		teacher: [
			{ icon: BookOpen, label: "Courses", href: "/user/courses" },
			{ icon: DollarSign, label: "Billing", href: "/user/billing" },
			{ icon: User, label: "Profile", href: "/user/profile" },
			{ icon: Settings, label: "Settings", href: "/user/settings" },
		],
	};

	if (!isLoaded) return <Loading />;
	if (!user) return <div>User not found</div>;

	const userType = user?.publicMetadata?.userType as "student" | "teacher";
	const currentNavLinks = navLinks[userType];

	return (
		<Sidebar
			collapsible="icon"
			style={{ height: "100vh" }}
			className="bg-customgreys-primarybg border-none shadow-lg"
		>
			<SidebarHeader>
				<SidebarMenu className="mt-5 group-data-[collapsible=icon]:mt-7">
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							onClick={() => toggleSidebar()}
							className="group hover:bg-customgreys-secondarybg"
						>
							<div className="flex justify-between items-center gap-5 pl-3 pr-1 h-10 w-full group-data-[collapsible=icon]:ml-1 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0 group">
								<div className="flex items-center gap-5">
									<Image
										src="/logo.svg"
										alt="logo"
										width={25}
										height={20}
										className="transition duration-200 group-data-[collapsible=icon]:group-hover:brightness-75 w-auto"
									/>
									<p className="text-lg font-extrabold group-data-[collapsible=icon]:hidden">
										EDROH
									</p>
								</div>
								<PanelLeft className="text-gray-400 w-5 h-5 group-data-[collapsible=icon]:hidden" />
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu className="mt-7 gap-0">
					{currentNavLinks.map((link) => {
						const isActive = pathname.startsWith(link.href);

						return (
							<SidebarMenuItem
								key={link.href}
								className={cn(
									"group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 hover:bg-customgreys-secondarybg",
									isActive && "bg-gray-800"
								)}
							>
								<SidebarMenuButton
									asChild
									size="lg"
									className={cn(
										"gap-4 p-8 hover:bg-customgreys-secondarybg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center",
										isActive && "text-customgreys-dirtyGrey"
									)}
								>
									<Link href={link.href} className="relative flex items-center">
										<link.icon
											className={isActive ? "text-white-50" : "text-gray-500"}
										/>
										<span
											className={cn(
												"font-medium text-md ml-4 group-data-[collapsible=icon]:hidden",
												isActive ? "text-white-50" : "text-gray-500"
											)}
										>
											{link.label}
										</span>
									</Link>
								</SidebarMenuButton>

								{isActive && (
									<div className="absolute right-0 top-0 h-full w-[4px] bg-primary-750" />
								)}
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<button
								onClick={() => signOut()}
								className="text-primary-700 pl-8"
							>
								<LogOut className="mr-2 h-6 w-6" />
								<span>Sign Out</span>
							</button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
