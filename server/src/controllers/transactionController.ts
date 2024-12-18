import Stripe from "stripe";
import "dotenv/config()";
import { Request, Response } from "express";

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error(
		"STRIPE_SECRET_KEY is required but was not found in env variables"
	);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (
	req: Request,
	res: Response
) => {
	let { amount } = req.body;

	if (!amount || amount <= 0) {
		amount = 50;
	}

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
				allow_redirects: "never",
			},
		});

		res.json({
			message: "",
			data: { clientSecret: paymentIntent.client_secret },
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating stripe payment intent", error });
	}
};