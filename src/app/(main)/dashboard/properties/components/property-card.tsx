"use client";

import { Pencil2Icon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { useOptimisticProperties } from "./use-optimistic-properties";

interface PropertyCardProps {
  property: RouterOutputs["property"]["myProperties"][number];
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const router = useRouter();
  const postMutation = api.property.delete.useMutation();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  const {setOptimisticProperties} = useOptimisticProperties()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">{property.title}</CardTitle>
        <CardDescription className="line-clamp-1 text-sm" suppressHydrationWarning>
          {property.createdAt?.toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-3 text-sm">{property.description}</CardContent>
      <CardFooter className="flex-row-reverse gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/property/${property.id}`}>
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
              await postMutation.mutateAsync(
                { id: property.id },
                {
                  onSettled: () => {
                    setOptimisticProperties({
                      action: "delete",
                      property,
                    });
                  },
                  onSuccess: () => {
                    toast.success("Property deleted");
                    router.refresh();
                  },
                  onError: () => {
                    toast.error("Failed to delete property");
                  },
                },
              );
            });
          }}
          disabled={isDeletePending}
        >
          <TrashIcon className="h-5 w-5" />
          <span className="sr-only">Delete</span>
        </Button>
        <Badge variant="outline" className="mr-auto rounded-lg capitalize">
          {property.status} Property
        </Badge>
      </CardFooter>
    </Card>
  );
};
