import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./property.input";
import * as services from "./property.service";

export const propertyRouter = createTRPCRouter({
  list: protectedProcedure
    .input(inputs.listPropertiesSchema)
    .query(({ ctx, input }) => services.listProperties(ctx, input)),

  get: protectedProcedure
    .input(inputs.getPropertySchema)
    .query(({ ctx, input }) => services.getProperty(ctx, input)),

  create: protectedProcedure
    .input(inputs.createPropertySchema)
    .mutation(({ ctx, input }) => services.createProperty(ctx, input)),

  update: protectedProcedure
    .input(inputs.updatePropertySchema)
    .mutation(({ ctx, input }) => services.updateProperty(ctx, input)),

  delete: protectedProcedure
    .input(inputs.deletePropertySchema)
    .mutation(async ({ ctx, input }) => services.deleteProperty(ctx, input)),

  listByLandlord: protectedProcedure
    .input(inputs.listPropertiesByLandlordSchema)
    .query(({ ctx, input }) => services.listPropertiesByLandlord(ctx, input)),

  myProperties: protectedProcedure
    .input(inputs.myPropertiesSchema)
    .query(({ ctx, input }) => services.myProperties(ctx, input)),
});
