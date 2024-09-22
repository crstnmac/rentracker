import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { api } from "@/trpc/server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PropertyEditor } from "./_components/property-editior";

interface Props {
  readonly params: {
    propertyId: string;
  };
}

export default async function EditPropertyPage({ params }: Props) {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  const property = await api.property.get.query({
    id: params.propertyId,
  });

  if (!property) notFound();

  return (
    <main className="container min-h-[calc(100vh-160px)] pt-3 md:max-w-screen-md">
      <Link href="/dashboard/properties" className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:underline">
        <ArrowLeftIcon  />
        back to dashboard
      </Link>

      <PropertyEditor property={property} />
    </main>
  );
}
