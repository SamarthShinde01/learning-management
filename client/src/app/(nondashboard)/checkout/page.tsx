import Loading from "@/components/Loading";
import WizardStepper from "@/components/WizardStepper";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useUser } from "@clerk/nextjs";

const CheckoutWizard = () => {
	const { isLoaded } = useUser();
	const { checkoutStep } = useCheckoutNavigation();

	if (!isLoaded) return <Loading />;

	const renderStep = () => {
		switch (checkoutStep) {
			case 1:
				return "checkout details page";
			case 2:
				return "payment page";
			case 3:
				return "completion page";
			default:
				return "checkout details page";
		}
	};

	return (
		<div className="w-full px-4 h-full flex flex-col items-center py-12">
			<WizardStepper currentStep={checkoutStep} />
			<div className="w-full max-w-screen-lg flex flex-col items-center mt-10">
				{renderStep()}
			</div>
		</div>
	);
};

export default CheckoutWizard;
