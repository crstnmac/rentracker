import { postRouter } from "./routers/post/post.procedure";
import { propertyRouter } from "./routers/property/property.procedure";
import { stripeRouter } from "./routers/stripe/stripe.procedure";
import { tenantRouter } from "./routers/tenants/tenant.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  stripe: stripeRouter,
  property: propertyRouter,
  tenants: tenantRouter,
});

export type AppRouter = typeof appRouter;
