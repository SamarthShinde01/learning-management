import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import StripeProvider from "./StripeProvider";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";

const PaymentPageContent = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [createTransaction] = useCreateTransactionMutation();
	const { navigateToStep } = useCheckoutNavigation();
	const { course, courseId } = useCurrentCourse();
	const { user } = useUser();
	const { signOut } = useClerk();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			toast.error("Stripe service is not available");
			return;
		}

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}?id=${courseId}`,
			},
			redirect: "if_required",
		});

		if (result.paymentIntent?.status === "succeeded") {
			const transactionData: Partial<Transaction> = {
				transactionId: result.paymentIntent.id,
				userId: user?.id,
				courseId: courseId,
				paymentProvider: "stripe",
				amount: course?.price || 0,
			};

			await createTransaction(transactionData);
			navigateToStep(3);
		}
	};

	const handleSignoutAndNavigate = async () => {
		await signOut();
		navigateToStep(1);
	};

	if (!course) return null;
	return (
		<div className="flex flex-col w-full">
			<div className="sm:flex gap-10 mb-6">
				{/* Order Summary */}
				<div className="basis-1/2 rounded-lg">
					<CoursePreview course={course} />
				</div>

				{/* Payment Form */}
				<div className="basis-1/2">
					<form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-col gap-4 bg-customgreys-secondarybg px-10 py-10 rounded-lg">
							<h1 className="text-2xl font-bold">Checkout</h1>
							<p className="text-sm text-gray-400">
								Fill out the payment details below to complete your purchase
							</p>

							<div className="flex flex-col gap-2 w-full mt-6">
								<h3 className="text-md">Payment Method</h3>

								<div className="flex flex-col border-[2px] border-white-100/5 rounded-lg">
									<div className="flex items-center gap-2 bg-white-50/5 py-2 px-2">
										<CreditCard size={24} />
										<span>Credit/Debit Card</span>
									</div>
									<div className="px-4 py-6">
										<PaymentElement />
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="flex justify-between items-center w-full mt-6">
				<Button
					className="hover:bg-white-50/10"
					onClick={handleSignoutAndNavigate}
					variant="outline"
					type="button"
				>
					Switch Account
				</Button>

				<Button
					form="payment-form"
					type="submit"
					className="payment__submit"
					disabled={!stripe || !elements}
				>
					Pay with Credit Card
				</Button>
			</div>
		</div>
	);
};

const PaymentPage = () => (
	<StripeProvider>
		<PaymentPageContent />
	</StripeProvider>
);

export default PaymentPage;
