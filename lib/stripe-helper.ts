import {prisma} from "@/lib/db";
import Stripe from "stripe";
import {clerkClient} from "@clerk/nextjs";

export const getOrCreateStripeCustomer = async (userId: string) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
    })

    let user = await prisma.user.findUnique({
        where: {
            userId: userId
        }
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                userId: userId,
            }
        })
    }

    const clerkUser = await clerkClient.users.getUser(userId)

    if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
            metadata: {
                userId: userId
            },
            email: clerkUser.emailAddresses.length > 0 ? clerkUser.emailAddresses[0].emailAddress : undefined,
            name: clerkUser.firstName + ' ' + clerkUser.lastName
        })

        await prisma.user.update({
            where: {
                userId: userId
            },
            data: {
                stripeCustomerId: customer.id
            }
        })

        return customer.id
    }
}