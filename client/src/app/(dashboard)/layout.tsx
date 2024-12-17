"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [courseId, setCourseId] = useState<string | null>(null);
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Loading />;
	if (!user) return <div>Please sign in to access this page.</div>;

	return (
		<SidebarProvider>
			<div className="min-h-screen w-full bg-customgreys-primarybg flex">
				<AppSidebar />

				<div className="flex flex-1 overflow-hidden">
					{/* chapters will go here */}

					<div
						className={cn(
							"flex-grow min-h-screen transition-all duration-500 ease-in-out overflow-y-auto bg-customgreys-secondarybg"
						)}
						style={{ height: "100vh" }}
					>
						<main className="px-8 py-4">{children}</main>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
