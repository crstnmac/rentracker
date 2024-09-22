"use client";

import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const NewTenant = ({ isEligible }: { isEligible: boolean }) => {
  const router = useRouter();

  const handleOnClick = () => {
    if (!isEligible) {
      toast.message("You've reached the limit of tenants for your current plan", {
        description: "Upgrade to create more tenants",
      });
    } else {
      router.push("/tenant/new");
    }
  };

  return (
    <Button
      onClick={handleOnClick}
      className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
    >
      <div className="flex flex-col items-center gap-4">
        <PersonIcon className="h-10 w-10" />
        <p className="text-sm">New Tenant</p>
      </div>{" "}
    </Button>
  );
};
