"use client";

import CoursePreview from "@/components/CoursePreview";
import Loading from "@/components/Loading";
import SignInComponent from "@/components/SignIn";
import SignUpComponent from "@/components/SignUp";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useSearchParams } from "next/navigation";

const CheckoutDetailsPage = () => {
	const { course: selectedCourse, isLoading, isError } = useCurrentCourse();
	const searchParams = useSearchParams();
	const showSignUp = searchParams.get("showSignUp") === "true";

	if (isLoading) return <Loading />;
	if (isError) return <div>Failed to fetch course data</div>;
	if (!selectedCourse) return <div>Course not found</div>;

	return (
		<div className="w-full h-fit gap-10">
			<div className="sm:flex gap-10">
				<div className="basis-1/2 rounded-lg">
					<CoursePreview course={selectedCourse} />
				</div>

				<div className="w-full bg-customgreys-secondarybg flex justify-center items-center rounded-lg">
					{showSignUp ? <SignUpComponent /> : <SignInComponent />}
				</div>
			</div>
		</div>
	);
};

export default CheckoutDetailsPage;
