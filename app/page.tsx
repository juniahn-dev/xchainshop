"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useProducts from "@/hooks/useProducts";
import { useAccount } from "@particle-network/connectkit";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { data: products } = useProducts();
  const { address } = useAccount();

  return (
    <main className="flex min-h-screen flex-col py-10 ml-10 w-full">
      <div className="flex flex-wrap gap-10">
        {products ? (
          products.map((product) => {
            return (
              <Card
                key={product.id}
                className="max-w-md overflow-hidden w-[350px] font-mono"
              >
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col p-4">
                  <div className="w-full mb-4">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex w-full space-x-2">
                    <Badge className="text-lg" variant="outline">
                      {product.state}
                    </Badge>
                    {product.state === "Sell" && product.owner !== address && (
                      <Button
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        ${product.price}XRP Buy
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <>
            <div className="flex flex-col space-y-3 w-[350px]">
              <Skeleton className="h-[230px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3 w-[350px]">
              <Skeleton className="h-[230px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3 w-[350px]">
              <Skeleton className="h-[230px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3 w-[350px]">
              <Skeleton className="h-[230px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
