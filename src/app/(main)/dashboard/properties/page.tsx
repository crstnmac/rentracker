import { validateRequest } from "@/lib/auth/validate-request";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Properties } from "./components/properties";
import { PostsSkeleton } from "../_components/posts-skeleton";
import React from "react";

export default async function PropertiesPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/signin");
  }

  const promises = Promise.all([
    api.property.list.query({
      perPage: 10,
      page: 1,
    }),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div className="grid gap-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Properties</h1>
        <p className="text-sm text-muted-foreground">Manage your properties here</p>
      </div>
      <React.Suspense fallback={<PostsSkeleton />}>
        <Properties promises={promises} />
      </React.Suspense>
    </div>
  );
}
