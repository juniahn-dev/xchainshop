"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="flex flex-wrap gap-10 w-3/5">
        {myProducts &&
          myProducts.map((product) => {
            return (
              <Card key={product.id} className="w-[350px] font-mono">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  <CardDescription>{product.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Image
                          src={product.image}
                          width={300}
                          height={300}
                          alt={""}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge className="text-lg" variant="outline">
                    {product.state}
                  </Badge>
                  <Button
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    View
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </main>
  );
}
