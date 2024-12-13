"use client";
import CourseCardSearch from "@/components/CourseCardSearch";
import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const { data: courses, isLoading, isError } = useGetCoursesQuery({});
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

	useEffect(() => {
		if (courses) {
			if (id) {
				const course = courses.find((c) => c.courseId === id);
				setSelectedCourse(course || courses[0]);
			} else {
				setSelectedCourse(courses[0]);
			}
		}
	}, [courses, id]);

	if (isLoading) return <Loading />;
	if (isError || !courses) return <div>Failed to fetch courses.</div>;

	const handleCourseSelect = (course: Course) => {
		setSelectedCourse(course);
		router.push(`/search?id=${course.courseId}`);
	};

	const handleEnrollNow = (courseId: string) => {
		router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col bg-background text-foreground h-full mx-auto w-3/4"
		>
			<h1 className="font-normal text-2xl mt-14">List of available courses</h1>
			<h2 className="text-gray-500 mb-3">{courses.length} courses available</h2>

			<div className="w-full flex flex-col-reverse md:flex-row pb-8 pt-2 gap-8">
				<motion.div
					initial={{ y: 40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="basis-3/5 grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-fr"
				>
					{courses.map((course) => (
						<CourseCardSearch
							key={course.courseId}
							isSelected={selectedCourse?.courseId === course.courseId}
							onClick={() => handleCourseSelect(course)}
							course={course}
						/>
					))}
				</motion.div>

				{selectedCourse && (
					<motion.div
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="basis-2/5 min-w-[350px] h-fit border-2 border-primary-600 bg-customgreys-secondarybg overflow-hidden rounded-lg"
					>
						<SelectedCourse
							course={selectedCourse}
							handleEnrollNow={handleEnrollNow}
						/>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};

export default Search;
