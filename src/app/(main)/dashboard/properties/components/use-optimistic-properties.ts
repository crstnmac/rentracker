"use client";

import { useState, useCallback } from "react";
import { type RouterOutputs } from "@/trpc/shared";

type Property = RouterOutputs["property"]["myProperties"][number];

export function useOptimisticProperties(initialProperties: Property[] = []) {
  const [optimisticProperties, setOptimisticProperties] = useState<Property[]>(initialProperties);

  const updateOptimisticProperties = useCallback(
    (action: {
      action: "add" | "delete" | "update" | "set";
      property?: Property;
      properties?: Property[];
    }) => {
      setOptimisticProperties((prev) => {
        switch (action.action) {
          case "delete":
            return prev.filter((p) => p.id !== action.property?.id);
          case "update":
            return prev.map((p) => (p.id === action.property?.id ? action.property : p));
          case "add":
            return action.property ? [...prev, action.property] : prev;
          case "set":
            return action.properties ?? prev;
          default:
            return prev;
        }
      });
    },
    [],
  );

  return { optimisticProperties, setOptimisticProperties: updateOptimisticProperties };
}
