"use client";

import pb from "@/api/pocketbase";
import { useBalance } from "@/atom/balance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrapper } from "@/components/wrapper";
import useProduct from "@/hooks/useProduct";
import { useAccount, useWallets } from "@particle-network/connectkit";
import { CHAIN_LIST } from "@/utils/chain";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";

export default function Home() {
  const [primaryWallet] = useWallets();

  const params = useParams();
  const { id } = params as { id: string };
  const { balance } = useBalance();
  const { address: account, chain } = useAccount();
  const { data: product } = useProduct(id);

  const onSendTransaction = useCallback(async () => {
    
    if (!product) {
      return;
    }
    if (!account) {
      alert("account loading..");
      return;
    }

    try {
      const usdcAbi = [
        {
          inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const data = encodeFunctionData({
        abi: usdcAbi,
        functionName: "transfer",
        args: [product.owner, Number(product.price) * 1000000],
      });

      const selectedChain = CHAIN_LIST[product.destination.toUpperCase()];

      const tx = {
        to: selectedChain.USDC_ADDRESS as Address,
        data,
        chain: selectedChain.CHAIN,
        account: account as Address,
      };
      const walletClient = primaryWallet.getWalletClient();
      const transactionResponse = await walletClient.sendTransaction(tx);

      await pb.collection("xchainshop").update(product.id, {
        state: "Reserved",
        buyer: account,
        tx: transactionResponse,
      });
      window.location.reload();
    } catch (e: any) {
      toast("Tx Error", {
        description: e.message,
      });
    }
  }, [account, chain, primaryWallet, product]);

  const onApprove = async () => {
    if (!product) {
      return;
    }
    await pb.collection("xchainshop").update(product.id, {
      state: "Approve",
    });
    window.location.reload();
  };

  return (
    <Wrapper>
      {product ? (
        <div className="z-10 w-full font-mono text-white space-y-5 flex gap-3">
          <div>
            <Image
              className="rounded-xl"
              src={product.image}
              width={600}
              height={700}
              alt={""}
            />
          </div>
          <div className="flex flex-col gap-9 px-3">
            <Badge
              variant="outline"
              className={`flex items-center ${
                product.state === "Sell"
                  ? "bg-green-200 text-green-900"
                  : "bg-gray-200 text-gray-600"
              } font-medium font-mono border-none rounded-xl px-2 py-1 w-[90px]`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  product.state === "Sell" ? "bg-green-700" : "bg-gray-600"
                }`}
              ></span>
              {product.state === "Sell" ? "For Sale" : "Reserved"}
            </Badge>
            <h1 className="text-3xl font-extrabold text-black dark:text-white">{product.name}</h1>
            <span className="border-b border-gray-400 h-px w-full"></span>
            <h1 className="text-bold text-2xl text-black dark:text-white">About Product</h1>
            <h1 className="text-black dark:text-white">{product.description}</h1>
            <span className="border-b border-gray-400 h-px w-full"></span>
            <div className="flex justify-evenly">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-black dark:text-white">Price</h1>
                <p className="text-black dark:text-white">{product.price} USDC</p>
              </div>
              <span className="border-l border-gray-400 w-px h-full "></span>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-black dark:text-white">Current Balance</h1>
                <p className="text-black dark:text-white">{balance} USDC</p>
              </div>
              <span className="border-l border-gray-400 w-px h-full"></span>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-black dark:text-white">Destination</h1>
                <p className="text-black dark:text-white">{product.destination}</p>
              </div>
            </div>

            <div className="space-y-5 px-2">
              {product?.state == "Sell" && product?.owner !== account && (
                <div className="flex space-x-4">
                  <Button
                    onClick={onSendTransaction}
                    className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-3xl w-full py-6 text-xl font-bold"
                  >
                    Buy Now
                  </Button>
                </div>
              )}

              {product?.buyer === account && (
                <div className="flex items-center text-black dark:text-white">
                  {account} is bought
                  <Button className="ml-3 text-black dark:text-white">
                    <Link
                      href={
                        product.destination === "SEPOLIA"
                          ? `https://sepolia.etherscan.io/tx/${product.tx}`
                          : `https://sepolia.basescan.org/tx/${product.tx}`
                      }
                    >
                      Go to Tx
                    </Link>
                  </Button>
                </div>
              )}

              {product?.state === "Sell" && product?.owner === account && (
                <div className="flex space-x-4">
                  <Button onClick={onSendTransaction}className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-3xl w-full py-6 text-xl font-bold">
                    Delete
                    </Button>
                </div>
              )}
              {product?.state === "Reserved" && product?.owner === account && (
                <div className="flex space-x-4 text-black dark:text-white">
                  <Button onClick={onApprove}>Approve</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 w-[550px]">
          <Skeleton className="h-[330px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </Wrapper>
  );
}
