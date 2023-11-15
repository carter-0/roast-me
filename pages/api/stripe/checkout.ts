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
                price: "price_1OCkIEH6wXsrIHOqa6pg02lp",
                quantity: 1,
            },
        ],
        success_url: `https://roastai.app/?success=true`,
        cancel_url: `https://roastai.app/`,
    };

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

    res.status(200).redirect(checkoutSession.url as string);
}