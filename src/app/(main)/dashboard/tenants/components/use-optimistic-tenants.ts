"use client";

import { useState, useCallback } from "react";
import { type RouterOutputs } from "@/trpc/shared";

type Tenant = RouterOutputs["tenants"]["list"][number];

export function useOptimisticTenants(initialTenants: Tenant[] = []) {
  const [optimisticTenants, setOptimisticTenants] =
    useState<Tenant[]>(initialTenants);

  const updateOptimisticTenants = useCallback(
    (action: {
      action: "add" | "delete" | "update" | "set";
      tenant?: Tenant;
      tenants?: Tenant[];
    }) => {
      setOptimisticTenants((prev) => {
        switch (action.action) {
          case "delete":
            return prev.filter((p) => p.tenantId !== action.tenant?.tenantId);
          case "update":
            return prev.map((p) =>
              p.tenantId === action.tenant?.tenantId ? action.tenant : p,
            );
          case "add":
            return action.tenant ? [...prev, action.tenant] : prev;
          case "set":
            return action.tenants ?? prev;
          default:
            return prev;
        }
      });
    },
    [],
  );

  return { optimisticTenants, setOptimisticTenants: updateOptimisticTenants };
}
