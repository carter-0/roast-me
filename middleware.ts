import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/api/roast-webhook", "/api/stripe/webhook", "/api/stripe/checkout", "/api/internalProcessRoast"]
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
};