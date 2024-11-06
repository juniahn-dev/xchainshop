"use client";

import { SkeletonCards } from "@/components/skeleton-cards";
import { Wrapper } from "@/components/wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProducts from "@/hooks/useProducts";
import { useAccount } from "@particle-network/connectkit";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Barcode, HandHelping } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: products } = useProducts();
  const { address } = useAccount();

  const renderProducts = (tab: string) => {
    return (
      <div className="flex flex-wrap gap-10">
        {products ? (
          products
            .filter((product) => {
              if (tab === "Sell") {
                return product.owner === address;
              } else if (tab === "Reserved") {
                return product.buyer === address;
              }
              return true;
            })
            .map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                description={product.description}
                price={product.price.toString()}
                state={product.state}
                address={address || ""}
              />
            ))
        ) : (
          <SkeletonCards />
        )}
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 font-mono">My Page</h1>
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="flex justify-start space-x-4 mb-4 bg-transparent">
            <TabsTrigger
              value="All"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md font-mono data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger
              value="Sell"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md font-mono data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              <HandHelping className="mr-2" />
              My Sell
            </TabsTrigger>
            <TabsTrigger
              value="Reserved"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md font-mono data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              <Barcode className="mr-2" />
              My Buy
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Sell">{renderProducts("Sell")}</TabsContent>
          <TabsContent value="Reserved">
            {renderProducts("Reserved")}
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
}
