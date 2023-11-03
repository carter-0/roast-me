import Stripe from "stripe";
import {NextApiRequest, NextApiResponse} from "next";
import {getAuth} from "@clerk/nextjs/server";
import {getOrCreateStripeCustomer} from "@/lib/stripe-helper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
    })

    const { userId } = getAuth(req);

    if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
    }

    const customer = await getOrCreateStripeCustomer(userId)

    const params: Stripe.Checkout.SessionCreateParams = {
        metadata: {
            userId: userId
        },
        customer: customer,
        mode: 'payment',
        submit_type: 'pay',
        line_items: [
            {
                price: "price_1NNhH8Dujc1FjWRN783Ey2VA",
                quantity: 1,
            },
        ],
        success_url: `https://example.com/success`,
        cancel_url: `https://example.com`,
    };

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

    res.status(200).redirect(checkoutSession.url as string);
}