"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreatePropertyInput,
  createPropertySchema,
} from "@/server/api/routers/property/property.input";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { useForm } from "react-hook-form";

interface Props {
  property: RouterOutputs["property"]["get"];
}

export const PropertyEditor = ({ property }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const updateProperty = api.property.update.useMutation();
  const form = useForm<CreatePropertyInput>({
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          status: property.status,
          address: property.address,
          city: property.city ?? "",
          zipCode: property.zipCode ?? "",
          state: property.state ?? "",
        }
      : {},
    resolver: zodResolver(createPropertySchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (property) {
      updateProperty.mutate({ id: property.id, ...values });
    }
  });

  if (!property) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil2Icon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{property.title}</h1>

        <LoadingButton
          disabled={!form.formState.isDirty}
          loading={updateProperty.isLoading}
          onClick={() => formRef.current?.requestSubmit()}
          className="ml-auto"
        >
          Save
        </LoadingButton>
      </div>
      <div className="h-6"></div>
      <Form {...form}>
        <form ref={formRef} onSubmit={onSubmit} className="block max-w-screen-md space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={2} className="min-h-0" />
                </FormControl>
                <FormDescription>A short description of your post</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
