import { properties } from "@/server/db/schema";
import { ProtectedTRPCContext } from "../../trpc";
import {
  CreatePropertyInput,
  DeletePropertyInput,
  GetPropertyInput,
  ListPropertiesByLandlordInput,
  ListPropertiesInput,
  MyPropertiesInput,
  UpdatePropertyInput,
} from "./property.input";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export const getProperty = async (ctx: ProtectedTRPCContext, input: GetPropertyInput) => {
  return ctx.db.query.properties.findFirst({
    where: eq(properties.id, input.id),
    with: {
      landlord: {
        columns: {
          email: true,
        },
      },
    },
  });
};

export const listProperties = async (ctx: ProtectedTRPCContext, input: ListPropertiesInput) => {
  return ctx.db.query.properties.findMany({
    where: eq(properties.landlordId, ctx.user.id),
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      status: true,
      createdAt: true,
      zipCode: true,
    },
    with: {
      landlord: {
        columns: {
          email: true,
        },
      },
    },
  });
};

export const createProperty = async (ctx: ProtectedTRPCContext, input: CreatePropertyInput) => {
  const id = generateId(15);

  await ctx.db.insert(properties).values({
    id,
    ...input,
    landlordId: ctx.user.id,
  });

  return { id };
};

export const updateProperty = async (ctx: ProtectedTRPCContext, input: UpdatePropertyInput) => {
  const { id, ...updateData } = input;

  const [item] = await ctx.db
    .update(properties)
    .set(updateData)
    .where(eq(properties.id, id))
    .returning();

  return item;
};

export const deleteProperty = async (ctx: ProtectedTRPCContext, input: DeletePropertyInput) => {
  const [item] = await ctx.db.delete(properties).where(eq(properties.id, input.id));
  return item;
};

export const listPropertiesByLandlord = async (
  ctx: ProtectedTRPCContext,
  input: ListPropertiesByLandlordInput,
) => {
  return ctx.db.query.properties.findMany({
    where: eq(properties.landlordId, input.landlordId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      status: true,
      createdAt: true,
      zipCode: true,
    },
    with: {
      landlord: {
        columns: {
          email: true,
        },
      },
    },
  });
};

export const myProperties = async (ctx: ProtectedTRPCContext, input: MyPropertiesInput) => {
  return ctx.db.query.properties.findMany({
    where: eq(properties.landlordId, ctx.user.id),
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      status: true,
      createdAt: true,
      zipCode: true,
    },
    with: {
      landlord: {
        columns: {
          email: true,
        },
      },
    },
  });
};
