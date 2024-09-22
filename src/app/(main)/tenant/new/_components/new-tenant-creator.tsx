"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTenantInput, createTenantSchema } from "@/server/api/routers/tenants/tenant.input";
import { Property } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export const NewTenantCreator = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const createTenant = api.tenants.create.useMutation();

  const landLordId = api.user.get.useQuery().data?.id;

  const properties = api.property.list.useQuery({
    
  }).data;

  console.log(properties);

  const form = useForm<CreateTenantInput>({
    resolver: zodResolver(createTenantSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    createTenant.mutate(values);
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil2Icon className="h-6 w-6" />
        <h1 className="text-lg font-semibold">Create a new tenant</h1>

        <LoadingButton
          onClick={onSubmit}
          loading={createTenant.isLoading}
          className="ml-auto"
          disabled={!form.formState.isDirty}
        >
          Create
        </LoadingButton>
      </div>
      <div className="h-6"></div>
      <Form {...form}>
        <form ref={formRef} onSubmit={onSubmit} className="block max-w-screen-md space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Amount</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentDueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Due Day</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property ID</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select  Property" {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(properties) &&
                        properties.map((property: Property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
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
