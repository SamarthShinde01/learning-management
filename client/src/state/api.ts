import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: any
) => {
	const baseQuery = fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
		prepareHeaders: async (headers) => {
			const token = await window.Clerk?.session?.getToken();

			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}

			return headers;
		},
	});

	try {
		const result: any = await baseQuery(args, api, extraOptions);

		if (result.error) {
			const errorData = result.error.data;
			const errorMessage = errorData?.message || "An error occured";
			toast.error(`Error: ${errorMessage}`);
		}

		const isMutationRequest =
			(args as FetchArgs).method && (args as FetchArgs).method !== "GET";

		if (isMutationRequest) {
			const successMessage = result.data?.message;
			if (successMessage) toast.success(successMessage);
		}

		if (result.data) {
			result.data = result.data.data;
		}

		return result;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown Error";

		return errorMessage;
	}
};

export const api = createApi({
	baseQuery: customBaseQuery,
	reducerPath: "api",
	tagTypes: ["Courses", "Users"],
	endpoints: (build) => ({
		/* ==============
		USERS
		============== */
		updateUser: build.mutation<User, Partial<User> & { userId: string }>({
			query: ({ userId, ...updatedUser }) => ({
				url: `/users/clerk/${userId}`,
				method: "PUT",
				body: updatedUser,
			}),
			invalidatesTags: ["Users"],
		}),

		/* ==============
		COURSES
		============== */
		getCourses: build.query<Course[], { category?: string }>({
			query: ({ category }) => ({
				url: "courses",
				params: { category },
			}),
			providesTags: ["Courses"],
		}),
		getCourse: build.query<Course, string>({
			query: (id) => `courses/${id}`,
			providesTags: (result, error, id) => [{ type: "Courses", id }],
		}),

		createCourse: build.mutation<
			Course,
			{ teacherId: string; teacherName: string }
		>({
			query: (body) => ({
				url: "courses",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Courses"],
		}),

		updateCourse: build.mutation<
			Course,
			{ courseId: string; formData: FormData }
		>({
			query: ({ courseId, formData }) => ({
				url: `courses/${courseId}`,
				method: "PUT",
				body: formData,
			}),
			invalidatesTags: (result, error, { courseId }) => [
				{ type: "Courses", id: courseId },
			],
		}),

		deleteCourse: build.mutation<{ message: string }, string>({
			query: (courseId) => ({
				url: `courses/${courseId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Courses"],
		}),

		/* ==============
		TRANSACTIONS
		============== */
		getTransactions: build.query<Transaction[], string>({
			query: (userId) => `transaction?userId=${userId}`,
		}),

		createStripePaymentIntent: build.mutation<
			{ clientSecret: string },
			{ amount: number }
		>({
			query: ({ amount }) => ({
				url: `/transaction/stripe/payment-intent`,
				method: "POST",
				body: { amount },
			}),
		}),

		createTransaction: build.mutation<Transaction, Partial<Transaction>>({
			query: (transaction) => ({
				url: "transaction",
				method: "POST",
				body: transaction,
			}),
		}),
	}),
});

export const {
	useUpdateUserMutation,
	useCreateCourseMutation,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useGetCoursesQuery,
	useGetCourseQuery,
	useGetTransactionsQuery,
	useCreateStripePaymentIntentMutation,
	useCreateTransactionMutation,
} = api;
