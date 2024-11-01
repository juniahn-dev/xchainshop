"use client";
import { SkeletonCards } from "@/components/skeleton-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProducts from "@/hooks/useProducts";
import { IProductProps } from "@/types/product";
import { useAccount } from "@particle-network/connectkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const [myProducts, setMyProducts] = useState<IProductProps[]>();
  const { data: products } = useProducts();

  useEffect(() => {
    if (address && products) {
      setMyProducts(products.filter((product) => product.owner == address));
    }
  }, [address, products]);

  return (
    <main className="flex min-h-screen flex-col py-10 ml-10 w-full">
      <div className="flex flex-wrap gap-10">
        {myProducts ? (
          myProducts.map((product) => {
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
                    <Button
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <SkeletonCards />
        )}
      </div>
    </main>
  );
}
