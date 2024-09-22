import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface NewPropertyProps {
  isEligible: boolean;
  setOptimisticProperties: (action: {
    action: "add" | "delete" | "update";
    property: RouterOutputs["property"]["list"][number];
  }) => void;
}

export const NewProperty = ({ isEligible, setOptimisticProperties }: NewPropertyProps) => {
  const router = useRouter();
  const properties = api.property.create.useMutation();

  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const createProperty = () => {
    if (!isEligible) {
      toast.message("You've reached the limit of properties for your current plan", {
        description: "Upgrade to create more properties",
      });
      return;
    }

    startCreateTransaction(async () => {
      await properties.mutateAsync(
        {
          title: "Untitled Property",
          description: "Write your content here",
          address: "untitled property",
          city: "untitled property",
          state: "test",
          location: "test",
          price: 0,
          status: "available",
          zipCode: "00000",
        },
        {
          onSettled: () => {
            setOptimisticProperties({
              action: "add",
              property: {
                id: crypto.randomUUID(),
                title: "Untitled Property",
                description: "untitled property",
                location: "",
                price: 0,
                status: "available",
                createdAt: new Date(),
                landlord: null,
                zipCode: "00000",
              },
            });
          },
          onSuccess: ({ id }) => {
            toast.success("Property created");
            router.refresh();
            // This is a workaround for a bug in navigation because of router.refresh()
            setTimeout(() => {
              router.push(`/property/${id}`);
            }, 100);
          },
          onError: () => {
            toast.error("Failed to create property");
          },
        },
      );
    });
  };

  return (
    <Button
      onClick={createProperty}
      className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
      disabled={isCreatePending}
    >
      <div className="flex flex-col items-center gap-4">
        <CardStackPlusIcon className="h-10 w-10" />
        <p className="text-sm">New Property</p>
      </div>{" "}
    </Button>
  );
};
