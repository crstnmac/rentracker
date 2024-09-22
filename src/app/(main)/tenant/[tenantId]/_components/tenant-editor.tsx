"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreateTenantInput, createTenantSchema } from "@/server/api/routers/tenants/tenant.input";
import { Property } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  tenant: RouterOutputs["tenants"]["list"][number];
}

export const TenantEditor = ({ tenant }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const updateTenant = api.tenants.update.useMutation();

  const landLordId = api.user.get.useQuery().data?.id;

  const properties = api.property.list.useQuery({}).data;

  console.log(properties);

  const form = useForm<CreateTenantInput>({
    defaultValues: tenant
      ? {
          firstName: tenant.tenantFirstName,
          lastName: tenant.tenantLastName,
          email: tenant.tenantEmail,
          rentAmount: tenant.rentAmount,
          rentDueDay: tenant.rentDueDay,
          propertyId: tenant.propertyId,
          startDate: tenant.leaseStart,
          endDate: tenant.leaseEnd,
        }
      : {},
    resolver: zodResolver(createTenantSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    updateTenant.mutate(values);
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil2Icon className="h-6 w-6" />
        <h1 className="text-lg font-semibold">Update tenant information</h1>

        <LoadingButton
          onClick={onSubmit}
          loading={updateTenant.isLoading}
          className="ml-auto"
          disabled={!form.formState.isDirty}
        >
          Update
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
                        properties.map((property) => (
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
            render={({ field, fieldState, formState }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
