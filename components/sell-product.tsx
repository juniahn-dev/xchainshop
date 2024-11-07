"use client";

import pb from "@/api/pocketbase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@particle-network/connectkit";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({
  name: z.string().default("").optional(),
  price: z.coerce.number().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  state: z.string().optional(),
  description: z.string().default("").optional(),
  owner: z.string().optional(),
  destination: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const SellProduct: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const action = "Create";
  const { address } = useAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: address,
      name: "iPhone15",
      description: "Brand new iPhone 15 with 1TB storage and 5G connectivity",
      price: 200,
      location: "Dreamplus",
      state: "Sell",
      image:
        "https://lh5.googleusercontent.com/p/AF1QipP4dsFswNUlKJayzgH8xVVzDlp03p038KKjIJ8w=w203-h135-k-no",
      destination: "Eth",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
        owner: address,
      };

      await pb.collection("xchainshop").create(formData);
      router.replace("/");
      router.refresh();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Product name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                      className="text-black dark:text-white"
                    />
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
                  <FormLabel className="text-black dark:text-white">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="description"
                      {...field}
                      className="text-black dark:text-white"
                    />
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
                  <FormLabel className="text-black dark:text-white">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Sell Location"
                      {...field}
                      className="text-black dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Image"
                      {...field}
                      className="text-black dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Price(USDC)
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Price"
                      {...field}
                      className="text-black dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="text-black dark:text-white">
                  <FormLabel className="text-black dark:text-white">
                    Receive Chain(Klaster)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            value="SEPOLIA"
                            className="text-black dark:text-white"
                          >
                            SEPOLIA
                          </SelectItem>
                          <SelectItem
                            value="BASE_SEPOLIA"
                            className="text-black dark:text-white"
                          >
                            BASE_SEPOLIA
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="text-black dark:text-white">
                  <FormLabel className="text-black dark:text-white">
                    Receive Chain(Cosmos)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            value="OSMOSIS"
                            className="text-black dark:text-white"
                          >
                            Osmosis
                          </SelectItem>
                          <SelectItem
                            value="AGORIC"
                            className="text-black dark:text-white"
                          >
                            Agoric
                          </SelectItem>
                          <SelectItem
                            value="COSMOS"
                            className="text-black dark:text-white"
                          >
                            Cosmos
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="invisible">
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Owner
                    </FormLabel>
                    <FormControl>
                      <Input disabled={true} placeholder="Owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            disabled={loading}
            className="ml-auto text-black dark:text-white"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
