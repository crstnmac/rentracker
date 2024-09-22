import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NewTenantCreator } from "./_components/new-tenant-creator";

export default async function NewTenantPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return (
    <main className="container min-h-[calc(100vh-160px)] pt-3">
      <Link
        href="/dashboard/tenants"
        className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeftIcon />
        back to dashboard
      </Link>

      <NewTenantCreator />
    </main>
  );
}
