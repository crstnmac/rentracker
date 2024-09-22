"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useOptimisticTenants } from "./use-optimistic-tenants";

interface Props {
  tenant: RouterOutputs["tenants"]["list"][number];
}

export const TenantCard = ({ tenant }: Props) => {
  const router = useRouter();

  const { setOptimisticTenants } = useOptimisticTenants();

  const tenantMutation = api.tenants.delete.useMutation();

  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">{tenant.tenantName}</CardTitle>
        <CardDescription className="line-clamp-1 text-sm" suppressHydrationWarning>
          {tenant.createdAt?.toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-row-reverse gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/tenant/${tenant.tenantId}`}>
            <Pencil2Icon className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => {
            startDeleteTransition(async () => {
              await tenantMutation.mutateAsync(
                { id: tenant.tenantId },
                {
                  onSettled: () => {
                    setOptimisticTenants({
                      action: "delete",
                      tenant,
                    });
                  },
                  onSuccess: () => {
                    toast.success("tenant deleted");
                    router.refresh();
                  },
                  onError: () => {
                    toast.error("Failed to delete tenant");
                  },
                },
              );
            });
          }}
          disabled={isDeletePending}
        >
          <TrashIcon />
        </Button>
      </CardFooter>
    </Card>
  );
};
