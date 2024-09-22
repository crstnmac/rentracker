"use client";

import { RouterOutputs } from "@/trpc/shared";
import React from "react";
import { TenantCard } from "./tenant-card";
import { useOptimisticTenants } from "./use-optimistic-tenants";
import { NewTenant } from "./new-tenant";

interface TenantsProps {
  promises: Promise<[RouterOutputs["tenants"]["list"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function Tenants({ promises }: Readonly<TenantsProps>) {
  const [tenants, subscriptionPlan] = React.use(promises);

  const { optimisticTenants } = useOptimisticTenants(tenants);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewTenant isEligible={(optimisticTenants.length < 2 || subscriptionPlan?.isPro) ?? false} />
      {optimisticTenants.map((tenant) => (
        <TenantCard key={tenant.tenantId} tenant={tenant} />
      ))}
    </div>
  );
}
