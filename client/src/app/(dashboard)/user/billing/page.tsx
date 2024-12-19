"use client";

import Loading from "@/components/Loading";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const UserBilling = () => {
	const [paymentType, setPaymentType] = useState("all");
	const { user, isLoaded } = useUser();
	const { data: transactions, isLoading: isLoadingTransactions } =
		useGetTransactionsQuery(user?.id || "", {
			skip: !isLoaded || !user,
		});

	const filteredData =
		transactions?.filter((transaction) => {
			const matchedType =
				paymentType === "all" || transaction.paymentProvider === paymentType;
			return matchedType;
		}) || [];

	if (!isLoaded) return <Loading />;
	if (!user) return <div>Please sign in to view your billing information.</div>;

	return (
		<div className="space-y-8">
			<div className="space-y-6 bg-customgreys-secondarybg">
				<h2 className="text-2xl font-semibold">Payment History</h2>
				<div className="flex space-x-4">
					<Select value={paymentType} onValueChange={setPaymentType}>
						<SelectTrigger className="w-[180px] border-none bg-customgreys-primarybg">
							<SelectValue placeholder="Payment Type"></SelectValue>
						</SelectTrigger>

						<SelectContent className="bg-customgreys-primarybg">
							<SelectItem
								className="hover:!bg-white-50 hover:!text-customgreys-primarybg cursor-pointer"
								value="all"
							>
								All Types
							</SelectItem>
							<SelectItem
								className="hover:!bg-white-50 hover:!text-customgreys-primarybg cursor-pointer"
								value="stripe"
							>
								Stripe
							</SelectItem>
							<SelectItem
								className="hover:!bg-white-50 hover:!text-customgreys-primarybg cursor-pointer"
								value="paypal"
							>
								Paypal
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="h-[400px] w-full">
					{isLoadingTransactions ? (
						<Loading />
					) : (
						<Table className="text-customgreys-dirtyGrey min-h-[200px]">
							<TableHeader className="bg-customgreys-darkGrey">
								<TableRow className=" border-none text-white-50">
									<TableHead className="border-none p-4">Sr No</TableHead>
									<TableHead className="border-none p-4">Date</TableHead>
									<TableHead className="border-none p-4">Amount</TableHead>
									<TableHead className="border-none p-4">
										Payment History
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="bg-customgreys-primarybg min-h-[200px]">
								{filteredData.length > 0 ? (
									filteredData.map((transaction, index) => (
										<TableRow
											className="border-none"
											key={transaction.transactionId}
										>
											<TableCell className="border-none p-4">
												{index + 1}
											</TableCell>
											<TableCell className="border-none p-4">
												{new Date(transaction.dateTime).toLocaleDateString()}
											</TableCell>
											<TableCell className="border-none p-4 font-medium">
												{formatPrice(transaction.amount)}
											</TableCell>
											<TableCell className="border-none p-4">
												{transaction.paymentProvider}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow className="border-none">
										<TableCell
											className="border-none p-4 text-center"
											colSpan={3}
										>
											No transactions to display
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserBilling;
