"use client";

import { RouterOutputs } from "@/trpc/shared";
import { NewProperty } from "./new-property";
import React from "react";
import { PropertyCard } from "./property-card";
import { useOptimisticProperties } from "./use-optimistic-properties";

interface PropertiesProps {
  promises: Promise<[RouterOutputs["property"]["list"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function Properties({ promises }: PropertiesProps) {
  const [properties, subscriptionPlan] = React.use(promises);

  const { optimisticProperties, setOptimisticProperties } = useOptimisticProperties(properties);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewProperty
        isEligible={(optimisticProperties.length < 2 || subscriptionPlan?.isPro) ?? false}
        setOptimisticProperties={setOptimisticProperties}
      />
      {optimisticProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
