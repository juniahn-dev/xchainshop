"use client";

import { SkeletonCards } from "@/components/skeleton-cards";
import { Wrapper } from "@/components/wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProducts from "@/hooks/useProducts";
import { useAccount } from "@particle-network/connectkit";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Barcode, HandHelping } from "lucide-react";
import { uniq } from "ramda";
import { Address, createWalletClient, custom, formatUnits } from "viem";
import { CHAIN_LIST, Chain } from "@/utils/chain";
import {
  initKlaster,
  loadBicoV2Account,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  klasterNodeHost,
} from "klaster-sdk";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: products } = useProducts();
  const { address } = useAccount();

  const [klasterAddress, setKlasterAddress] = useState<any[] | null>(null);
  const [totalUSDC, setTotalUSDC] = useState<string | null>(null);
  const [chainBalances, setChainBalances] = useState<any[] | null>(null);

  useEffect(() => {
    const init = async () => {
      const signer = createWalletClient({
        transport: custom((window as any).ethereum),
      });
      if (!address) return;

      const klasterInit = await initKlaster({
        accountInitData: loadBicoV2Account({ owner: address as Address }),
        nodeUrl: klasterNodeHost.default,
      });

      const mcClient = buildMultichainReadonlyClient(
        Object.values(CHAIN_LIST).map((chain) => ({
          chainId: chain.CHAIN_ID,
          rpcUrl: chain.RPC_URL,
        }))
      );
      const mcUSDC = buildTokenMapping(
        Object.values(CHAIN_LIST).map((chain) =>
          deployment(chain.CHAIN_ID, chain.USDC_ADDRESS)
        )
      );

      const uBalance = await mcClient.getUnifiedErc20Balance({
        tokenMapping: mcUSDC,
        account: klasterInit.account,
      });
      setTotalUSDC(formatUnits(uBalance.balance, uBalance.decimals));
      setChainBalances(
        uBalance.breakdown.map((balance) => ({
          chain: getChainNameById(balance.chainId),
          balance: formatUnits(balance.amount, uBalance.decimals),
        }))
      );
      setKlasterAddress(
        klasterInit.account.getAddresses(
          Object.values(CHAIN_LIST).map((chain) => chain.CHAIN_ID)
        )
      );
    };

    init();
  }, [address]);

  const getChainNameById = (chainId: number): string | undefined => {
    const chain = Object.values(CHAIN_LIST).find(
      (chain) => chain.CHAIN_ID === chainId
    );
    return chain ? chain.NAME : undefined;
  };

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
        <Tabs defaultValue="My Profile" className="mb-8">
          <TabsList className="flex justify-start space-x-4 mb-4 bg-transparent">
            <TabsTrigger
              value="My Profile"
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
          <TabsContent value="My Profile">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-1/2">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Your Information
              </h2>
              <div className="space-y-4 ml-3">
                {klasterAddress &&
                  uniq(klasterAddress).map((address, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2"
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Address {index + 1}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-mono">
                        {address}
                      </span>
                    </div>
                  ))}
                {chainBalances &&
                  chainBalances.map((chainBalance, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2"
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {chainBalance.chain} Balance
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-mono">
                        {chainBalance.balance} USDC
                      </span>
                    </div>
                  ))}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold">
                    Total USDC
                  </span>
                  <span className="text-lg text-gray-900 dark:text-gray-100 font-bold font-mono">
                    {totalUSDC} USDC
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Sell">{renderProducts("Sell")}</TabsContent>
          <TabsContent value="Reserved">
            {renderProducts("Reserved")}
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
}
