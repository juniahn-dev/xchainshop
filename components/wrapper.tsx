"use client";

import { useBalance } from "@/app/atom/balance";
import { useAccount, usePublicClient } from "@particle-network/connectkit";
import { useEffect } from "react";
import { erc20Abi } from "viem";
import { Toaster } from "./ui/sonner";

export function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { setBalance } = useBalance();

  const fetchBalance = async () => {
    if (address) {
      const balance = await publicClient?.readContract({
        address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as "0x"],
      });

      setBalance(Number(balance) / 1000000);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  return (
    <main className="flex min-h-screen flex-col py-10 ml-10 w-full">
      {children}
      <Toaster position="top-right" />
    </main>
  );
}
