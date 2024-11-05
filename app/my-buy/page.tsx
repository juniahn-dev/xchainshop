"use client";

import { Wrapper } from "@/components/wrapper";
import useProducts from "@/hooks/useProducts";
import { IProductProps } from "@/types/product";
import { useAccount } from "@particle-network/connectkit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCards } from "@/components/skeleton-cards";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const [myProducts, setMyProducts] = useState<IProductProps[]>();
  const { data: products } = useProducts();

  useEffect(() => {
    if (address && products) {
      setMyProducts(products.filter((product) => product.buyer == address));
    }
  }, [address, products]);

  return (
    <Wrapper>
      <div className="flex flex-wrap gap-10 w-3/5">
        {myProducts ? (
          myProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              description={product.description}
              price={product.price}
              state={product.state}
              address={address || ""}
            />
          ))
        ) : (
          <SkeletonCards />
        )}
      </div>
    </Wrapper>
  );
}
