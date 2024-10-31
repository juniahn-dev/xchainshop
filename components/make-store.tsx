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
  menu: z.string().optional(),
  price: z.coerce.number().optional(),
  image: z.string().optional(),
  description: z.string().default("").optional(),
  owner: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const MakeStore: React.FC = () => {
  const { address } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const title = "Make store";
  const action = "Create";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: address,
      name: "Phed Mark",
      menu: "Phed",
      description:
        "Phed Mark - Easily one of the most popular and loved dishes throughout Thailand.",
      price: 10,
      image:
        "https://lh5.googleusercontent.com/p/AF1QipP4dsFswNUlKJayzgH8xVVzDlp03p038KKjIJ8w=w203-h135-k-no",
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
      <h1 className="font-bold text-lg">{title}</h1>
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
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Menu" {...field} />
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
                    <Input
                      disabled={loading}
                      placeholder="description"
                      {...field}
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
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Image" {...field} />
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
                  <FormLabel>Price(USDT)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input disabled={true} placeholder="Owner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
