"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";

const SignUpComponent = () => {
	const { user } = useUser();
	const searchParams = useSearchParams();
	const isCheckoutPage = searchParams.get("showSignUp") !== null;
	const courseId = searchParams.get("id");

	const signInUrl = isCheckoutPage
		? `/checkout?step=1&id=${courseId}$showSignUp=false`
		: "/signin";

	const getRedirectUrl = () => {
		if (isCheckoutPage) {
			return `/checkout?step=2$id=${courseId}`;
		}

		const userType = user?.publicMetadata?.userType as string;
		if (userType === "teacher") {
			return "/teacher/courses";
		}

		return "/user/courses";
	};

	return (
		<div>
			<SignUp
				appearance={{
					baseTheme: dark,
					elements: {
						rootBox: "flex items-center justify-center py-5",
						cardBox: "shadow-none",
						card: "bg-customgreys-secondarybg w-full shadow-none",
						formFieldLabel: "text-white-50 font-normal",
						footer: {
							background: "#25262F",
							padding: "0rem 2.5rem",
							"& > div > div:nth-child(1)": { background: "#25262F" },
							"cl-internal-16vtwdp": { color: "red" },
						},
						formButtonPrimary:
							"bg-primary-750 hover:bg-primary-600 text-white-100 !shadow-none ",
						formFieldInput:
							"bg-customgreys-primarybg text-white-50 !shadow-none placeholder-transparent",
						footerActionLink: "text-primary-750 hover:text-primary-600",
					},
				}}
				signInUrl={signInUrl}
				forceRedirectUrl={getRedirectUrl()}
				routing="hash"
				afterSignOutUrl="/"
			/>
		</div>
	);
};

export default SignUpComponent;
