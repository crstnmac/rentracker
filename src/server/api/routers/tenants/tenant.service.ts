import { leases, properties, users } from "@/server/db/schema";
import { ProtectedTRPCContext } from "../../trpc";
import { CreateTenantInput, ListTenantsInput } from "./tenant.input";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export const listTenants = async (ctx: ProtectedTRPCContext, input: ListTenantsInput) => {
  return ctx.db
    .select({
      tenantId: users.id,
      tenantFirstName: users.firstName,
      tenantLastName: users.lastName,
      tenantName: users.name,
      tenantEmail: users.email,
      propertyAddress: properties.address,
      leaseStart: leases.startDate,
      leaseEnd: leases.endDate,
      createdAt: leases.createdAt,
      rentAmount: leases.rentAmount,
      rentDueDay: leases.rentDueDay,
      propertyId: leases.propertyId
    })
    .from(properties)
    .innerJoin(leases, eq(properties.id, leases.propertyId))
    .innerJoin(users, eq(leases.tenantId, users.id))
    .where(eq(properties.landlordId, ctx.user.id))
    .limit(input.perPage)
    .offset((input.page - 1) * input.perPage);
};

export const getTenant = async (ctx: ProtectedTRPCContext, input: { id: string }) => {
  const [tenant] = await ctx.db
    .select({
      tenantId: users.id,
      tenantFirstName: users.firstName,
      tenantLastName: users.lastName,
      tenantName: users.name,
      tenantEmail: users.email,
      propertyAddress: properties.address,
      leaseStart: leases.startDate,
      leaseEnd: leases.endDate,
      createdAt: leases.createdAt,
      rentAmount: leases.rentAmount,
      rentDueDay: leases.rentDueDay,
      propertyId: leases.propertyId,
    })
    .from(properties)
    .innerJoin(leases, eq(properties.id, leases.propertyId))
    .innerJoin(users, eq(leases.tenantId, users.id))
    .where(eq(users.id, input.id));

  return tenant;
};

export const createTenant = async (ctx: ProtectedTRPCContext, input: CreateTenantInput) => {
  return await ctx.db.transaction(async (trx) => {
    const id = generateId(15);

    const [newUser] = await trx
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: input.email,
        name: `${input.firstName} ${input.lastName}`,
        firstName: input.firstName,
        lastName: input.lastName,
        userType: "tenant",
      })
      .returning({ id: users.id });

    const [newLease] = await trx
      .insert(leases)
      .values({
        id: id,
        propertyId: input.propertyId,
        tenantId: newUser?.id,
        rentAmount: input.rentAmount,
        rentDueDay: input.rentDueDay,
      })
      .returning({ id: leases.id });

    return { userId: newUser?.id, leaseId: newLease?.id };
  });
};

export const updateTenant = async (ctx: ProtectedTRPCContext, input: CreateTenantInput & { id: string }) => {
  return await ctx.db.transaction(async (trx) => {
    await trx
      .update(users)
      .set({
        email: input.email,
        name: `${input.firstName} ${input.lastName}`,
        firstName: input.firstName,
        lastName: input.lastName,
      })
      .where(eq(users.id, input.id));

    await trx
      .update(leases)
      .set({
        propertyId: input.propertyId,
        rentAmount: input.rentAmount,
        rentDueDay: input.rentDueDay,
      })
      .where(eq(leases.tenantId, input.id));
  });
};

export const deleteTenant = async (ctx: ProtectedTRPCContext, input: { id: string }) => {
  return await ctx.db.transaction(async (trx) => {
    await trx.delete(users).where(eq(users.id, input.id));
    await trx.delete(leases).where(eq(leases.tenantId, input.id));
  });
};