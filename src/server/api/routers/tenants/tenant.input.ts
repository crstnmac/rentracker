import { z } from 'zod';

export const listTenantsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export type ListTenantsInput = z.infer<typeof listTenantsSchema>;

export const getTenantSchema = z.object({
  id: z.string(),
});

export type GetTenantInput = z.infer<typeof getTenantSchema>;

export const createTenantSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(3).max(255),
  passwordHash: z.string().min(3).max(255),
  propertyId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  rentAmount: z.number().min(0),
  rentDueDay: z.number().min(1).max(31),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = createTenantSchema.extend({
  id: z.string(),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

export const deleteTenantSchema = z.object({
  id: z.string(),
});

export type DeleteTenantInput = z.infer<typeof deleteTenantSchema>;

export const listTenantsByLandlordSchema = z.object({
  landlordId: z.string(),
});

export type ListTenantsByLandlordInput = z.infer<typeof listTenantsByLandlordSchema>;

export const myTenantsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export type MyTenantsInput = z.infer<typeof myTenantsSchema>;

export const listTenantsByPropertySchema = z.object({
  propertyId: z.string(),
});

export type ListTenantsByPropertyInput = z.infer<typeof listTenantsByPropertySchema>;

export const listTenantsByPropertyAndLandlordSchema = z.object({
  propertyId: z.string(),
  landlordId: z.string(),
});
