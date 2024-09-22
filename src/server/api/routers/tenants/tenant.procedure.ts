import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./tenant.input";
import * as services from "./tenant.service";

export const tenantRouter = createTRPCRouter({
  list: protectedProcedure
    .input(inputs.listTenantsSchema)
    .query(({ ctx, input }) => services.listTenants(ctx, input)),

  get: protectedProcedure
    .input(inputs.getTenantSchema)
    .query(({ ctx, input }) => services.getTenant(ctx, input)),

  create: protectedProcedure
    .input(inputs.createTenantSchema)
    .mutation(({ ctx, input }) => services.createTenant(ctx, input)),

  update: protectedProcedure
    .input(inputs.updateTenantSchema)
    .mutation(({ ctx, input }) => services.updateTenant(ctx, input)),

  delete: protectedProcedure
    .input(inputs.deleteTenantSchema)
    .mutation(async ({ ctx, input }) => services.deleteTenant(ctx, input)),
})
