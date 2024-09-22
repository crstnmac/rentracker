import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";
import { Tenants } from "./components/tenants";

export default async function TenantsPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  const promises = Promise.all([
    api.tenants.list.query({
      perPage: 10,
      page: 1,
    }),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Tenants</h1>
        <p className="text-sm text-muted-foreground">Manage your tenants</p>
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Tenants promises={promises} />
      </React.Suspense>
    </div>
  );
}
