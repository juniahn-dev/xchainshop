"use client";

import { ProductCard } from "@/components/ProductCard";
import { SkeletonCards } from "@/components/skeleton-cards";
import { Wrapper } from "@/components/wrapper";
import useProducts from "@/hooks/useProducts";
import { IProductProps } from "@/types/product";
import { CHAIN_LIST } from "@/utils/chain";
import { useAccount } from "@particle-network/connectkit";
import {
  Address,
  initKlaster,
  klasterNodeHost,
  loadBicoV2Account,
} from "klaster-sdk";
import { uniq } from "ramda";
import { useEffect, useState } from "react";

export default function Home() {
  const { address } = useAccount();
  const [myProducts, setMyProducts] = useState<IProductProps[]>();
  const [klasterAddress, setKlasterAddress] = useState<any[] | null>(null);
  const { data: products } = useProducts();

  useEffect(() => {
    const init = async () => {
      const klasterInit = await initKlaster({
        accountInitData: loadBicoV2Account({
          owner: address as Address,
        }),
        nodeUrl: klasterNodeHost.default,
      });

      const klasterAddress = klasterInit.account.getAddresses(
        Object.values(CHAIN_LIST).map((chain) => chain.CHAIN_ID)
      );

      setKlasterAddress(klasterAddress);
    };

    init();
  }, [address]);

  useEffect(() => {
    if (address && products) {
      setMyProducts(products.filter((product) => product.buyer == address));
    }
  }, [address, products]);

  return (
    <Wrapper>
      <div className="flex flex-wrap gap-10 w-3/5">
        <div>
          {klasterAddress &&
            uniq(klasterAddress).map((address, index) => {
              return <div key={index}>AA Address: {address}</div>;
            })}
        </div>
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
