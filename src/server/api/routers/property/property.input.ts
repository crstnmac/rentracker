import { z } from "zod";

export const listPropertiesSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export type ListPropertiesInput = z.infer<typeof listPropertiesSchema>;

export const getPropertySchema = z.object({
  id: z.string(),
});

export type GetPropertyInput = z.infer<typeof getPropertySchema>;

export const createPropertySchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  price: z.string().min(0),
  location: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  city: z.string().min(3).max(100),
  status: z.enum(["available", "rented", "sold", "leased"]).default("available"),
  state: z.string().min(3).max(100),
  zipCode: z.string().min(3).max(100),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema.extend({
  id: z.string(),
});

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const deletePropertySchema = z.object({
  id: z.string(),
});

export type DeletePropertyInput = z.infer<typeof deletePropertySchema>;

export const listPropertiesByLandlordSchema = z.object({
  landlordId: z.string(),
});

export type ListPropertiesByLandlordInput = z.infer<
  typeof listPropertiesByLandlordSchema
>;

export const myPropertiesSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export type MyPropertiesInput = z.infer<typeof myPropertiesSchema>;