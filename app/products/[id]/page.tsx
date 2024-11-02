"use client";

import pb from "@/api/pocketbase";
import { useBalance } from "@/app/atom/balance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrapper } from "@/components/wrapper";
import useProduct from "@/hooks/useProduct";
import { useAccount, useWallets } from "@particle-network/connectkit";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { encodeFunctionData, type Address } from "viem";

// import crypto from "crypto";
// import { PreimageSha256 } from "five-bells-condition";
// import { web3auth } from "@/utils/web3-auth";

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

      const tx = {
        to: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238" as Address,
        data,
        chain,
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
  // const onReceive =async() => {
  //   if (!account){
  //     alert('account loading..')
  //     return;
  //   }
  //   if (!product) {
  //     return;
  //   }
  //   console.log(product)
  //   const tx = {
  //     TransactionType: "EscrowFinish",
  //     Account: account,
  //     Owner: product.buyer,
  //     OfferSequence: product.sequence, // 에스크로 트랜잭션의 시퀀스 번호
  //     Condition: product.condition, // 생성된 조건
  //     Fulfillment: product.fulfillment
  //   };

  //   console.log(tx)
  //   const txSign: any = await provider?.request({
  //     method: "xrpl_submitTransaction",
  //     params: {
  //       transaction: tx,
  //     },
  //   });
  //   console.log("txSign : ",txSign)
  //   await pb.collection("xchainshop").update(product.id, {
  //     state: "Complete",
  //   });
  //   //window.location.reload()
  // }
  // const onEscrowSendTransaction = async () => {
  //   try {

  //     if (!account){
  //       alert('account loding..')
  //       return;
  //     }
  //     const preimageData = crypto.randomBytes(32);

  //     // Create a new PreimageSha256 fulfillment
  //     const myFulfillment = new PreimageSha256();
  //     myFulfillment.setPreimage(preimageData);

  //     // Get the condition in hex format
  //     const conditionHex = myFulfillment
  //       .getConditionBinary()
  //       .toString("hex")
  //       .toUpperCase();
  //     console.log("Condition in hex format: ", conditionHex);

  //     let finishAfter = new Date(new Date().getTime() / 1000);
  //     finishAfter = new Date(finishAfter.getTime() * 1000 + 3);
  //     console.log("This escrow will finish after!!: ", finishAfter);

  //     console.log(product)
  //     if (!product) {
  //       return;
  //     }

  //     const tx = {
  //       TransactionType: "EscrowCreate",
  //       Account: account,
  //       Amount: xrpToDrops(product.price),
  //       Destination: product.owner,
  //       Condition: conditionHex, // SHA-256 해시 조건
  //       FinishAfter: isoTimeToRippleTime(finishAfter.toISOString()), // Refer for more details: https://xrpl.org/basic-data-types.html#specifying-time
  //     };
  //     console.log("tx", tx)
  //     const txSign: any = await provider?.request({
  //       method: "xrpl_submitTransaction",
  //       params: {
  //         transaction: tx,
  //       },
  //     });

  //     console.log("txRes", txSign);
  //     console.log(
  //       "txRes.result.tx_json.OfferSequence :",
  //       txSign.result.tx_json.Sequence
  //     );
  //     console.log("condition : ", conditionHex);
  //     console.log(
  //       "fullfillment : ",
  //       myFulfillment.serializeBinary().toString("hex").toUpperCase()
  //     );
  //     const txHash = txSign.result.tx_json.hash; // Extract transaction hash from the response

  //     await pb.collection("xchainshop").update(product.id, {
  //       txhash: txHash,
  //       fulfillment: myFulfillment
  //         .serializeBinary()
  //         .toString("hex")
  //         .toUpperCase(),
  //       condition: conditionHex,
  //       sequence: txSign.result.tx_json.Sequence,
  //       state: "Reserved",
  //       buyer: account,
  //     });
  //     alert("Escrow Success");
  //     window.location.reload();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  return (
    <Wrapper>
      {product ? (
        <div className="z-10 w-full font-mono text-white space-y-5">
          <Image src={product.image} width={500} height={500} alt={""} />
          <Badge variant="secondary" className="text-2xl">
            {product.state}
          </Badge>
          <h1 className="text-2xl font-extrabold">{product.name}</h1>
          <h1>{product.description}</h1>

          <div className="space-y-5">
            <h1>Price : {product.price} USDC</h1>
            <h1>Available : {balance} USDC</h1>

            {product?.state == "Sell" && product?.owner !== account && (
              <div className="flex space-x-4">
                <Button onClick={onSendTransaction}>Buy</Button>
              </div>
            )}

            {product?.buyer === account && (
              <div className="flex items-center">
                {account} is bought
                <Button className="ml-3">
                  <Link href={`https://sepolia.etherscan.io/tx/${product.tx}`}>
                    Go to Tx
                  </Link>
                </Button>
              </div>
            )}

            {product?.state === "Sell" && product?.owner === account && (
              <div className="flex space-x-4">
                <Button onClick={onSendTransaction}>Delete</Button>
              </div>
            )}
            {product?.state === "Reserved" && product?.owner === account && (
              <div className="flex space-x-4">
                <Button onClick={onApprove}>Approve</Button>
              </div>
            )}
            {/* {product?.state === "Approve" && product?.owner === account && (
                <div className="flex space-x-4">
                  <Button onClick={onReceive}>Receive</Button>
                </div>
            )} */}
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
