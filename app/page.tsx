"use client";

import { SkeletonCards } from "@/components/skeleton-cards";
import { Wrapper } from "@/components/wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProducts from "@/hooks/useProducts";
import { useAccount } from "@particle-network/connectkit";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const router = useRouter();

  const { data: products } = useProducts();
  const { address } = useAccount();

  const renderProducts = (state: string) => {
    return (
      <div className="flex flex-wrap gap-10">
        {products ? (
          products
            .filter((product) => state === "All" || product.state === state)
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
        <h1 className="text-2xl font-bold mb-4 ">XChainshop</h1>
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="flex justify-start space-x-4 mb-4 bg-transparent">
            <TabsTrigger
              value="All"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md  data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Sell"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md  data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              For Sale
            </TabsTrigger>
            <TabsTrigger
              value="Reserved"
              className="flex items-center justify-center pb-2 px-4 border-b-2 border-transparent hover:shadow-lg text-md  data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
            >
              Reserved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="All">{renderProducts("All")}</TabsContent>
          <TabsContent value="Sell">{renderProducts("Sell")}</TabsContent>
          <TabsContent value="Reserved">
            {renderProducts("Reserved")}
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
}
