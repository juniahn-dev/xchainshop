"use client";

import pb from "@/api/pocketbase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrapper } from "@/components/wrapper";
import useProduct from "@/hooks/useProduct";
import { acrossBridgePlugin } from "@/plugin/acrossBridgePlugin";
import { CHAIN_LIST } from "@/utils/chain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useWallets } from "@particle-network/connectkit";
import {
  BiconomyV2AccountInitData,
  buildItx,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  encodeBridgingOps,
  initKlaster,
  klasterNodeHost,
  KlasterSDK,
  loadBicoV2Account,
  PaymentTokenSymbol,
  rawTx,
  singleTx,
} from "klaster-sdk";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { uniq } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createWalletClient,
  custom,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  parseUnits,
  type Address,
} from "viem";
import * as z from "zod";

export default function Home() {
  const [klaster, setKlaster] =
    useState<KlasterSDK<BiconomyV2AccountInitData> | null>(null);
  const [mUSDC, setMUSDC] = useState<any | null>(null);
  const [mcClient, setMcClient] = useState<any | null>(null);
  const [klasterAddress, setKlasterAddress] = useState<any[] | null>(null);
  const [totalUSDC, setTotalUSDC] = useState<string | null>(null);
  const [chainBalances, setChainBalances] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedFeeChain, setSelectedFeeChain] = useState<Chain | null>(null);
  const [selectedFeeToken, setSelectedFeeToken] = useState<string | null>(null);

  const [primaryWallet] = useWallets();
  const params = useParams();
  const { id } = params as { id: string };
  const { address: account } = useAccount();
  const { data: product } = useProduct(id);

  const formSchema = z.object({
    recipient: z.string(),
    amount: z.any(),
  });

  type FormValues = z.infer<typeof formSchema>;

  type Chain = {
    NAME: string;
    CHAIN: any;
    CHAIN_ID: number;
    USDC_ADDRESS: Address;
    RPC_URL: string;
  };

  const FEE_TOKEN: { [key: string]: string } = {
    ETH: "ETH",
    USDC: "USDC",
  };

  const onApprove = async () => {
    if (!product) {
      return;
    }
    await pb.collection("xchainshop").update(product.id, {
      state: "Approve",
    });
    window.location.reload();
  };

  const getChainNameById = useCallback(
    (chainId: number): string | undefined => {
      const chain = Object.values(CHAIN_LIST).find(
        (chain) => chain.CHAIN_ID === chainId
      );
      return chain ? chain.NAME : undefined;
    },
    []
  );

  useEffect(() => {
    const init = async () => {
      const signer = createWalletClient({
        transport: custom((window as any).ethereum),
      });
      if (!account) return;

      const klasterInit = await initKlaster({
        accountInitData: loadBicoV2Account({
          owner: account as Address,
        }),
        nodeUrl: klasterNodeHost.default,
      });

      const mcClient = buildMultichainReadonlyClient(
        Object.values(CHAIN_LIST).map((chain) => {
          return {
            chainId: chain.CHAIN_ID,
            rpcUrl: chain.RPC_URL,
          };
        })
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
      const totalUSDC = formatUnits(uBalance.balance, uBalance.decimals);
      const chainBalances = uBalance.breakdown.map((balance) => {
        return {
          chain: getChainNameById(balance.chainId),
          balance: formatUnits(balance.amount, uBalance.decimals),
        };
      });

      const klasterAddress = klasterInit.account.getAddresses(
        Object.values(CHAIN_LIST).map((chain) => chain.CHAIN_ID)
      );

      setTotalUSDC(totalUSDC);
      setChainBalances(chainBalances);
      setKlasterAddress(klasterAddress);
      setKlaster(klasterInit);
      setMUSDC(mcUSDC);
      setMcClient(mcClient);
      setLoading(false);
    };

    init();
  }, [account, getChainNameById]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: undefined,
    },
  });

  useEffect(() => {
    if (product) {
      const chain = CHAIN_LIST[product.destination as keyof typeof CHAIN_LIST];
      setSelectedChain(chain);

      form.setValue("recipient", product.owner);
      form.setValue("amount", product.price);
    }
  }, [form, product]);

  const handleFeeChainChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const chainName = event.target.value;
    const chain = CHAIN_LIST[chainName as keyof typeof CHAIN_LIST];
    setSelectedFeeChain(chain);
  };
  const handleFeeTokenChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const feeToken = event.target.value;
    setSelectedFeeToken(feeToken);
  };

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!product) {
        return;
      }
      if (!klaster) {
        return;
      }

      try {
        const uBalance = await mcClient.getUnifiedErc20Balance({
          tokenMapping: mUSDC,
          account: klaster.account,
        });

        const destinationChain = selectedChain as Chain;
        const feeChain = selectedFeeChain as Chain;
        const feeToken = selectedFeeToken as PaymentTokenSymbol;
        const bridgingOps = await encodeBridgingOps({
          tokenMapping: mUSDC,
          account: klaster.account,
          amount: parseUnits(data.amount, uBalance.decimals),
          bridgePlugin: acrossBridgePlugin,
          client: mcClient,
          destinationChainId: destinationChain.CHAIN_ID,
          unifiedBalance: uBalance,
        });

        const sendERC20Op = rawTx({
          gasLimit: BigInt(100000),
          to: destinationChain.USDC_ADDRESS as Address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [
              data.recipient as Address,
              bridgingOps.totalReceivedOnDestination,
            ],
          }),
        });

        const iTx = buildItx({
          steps: bridgingOps.steps.concat(
            singleTx(destinationChain.CHAIN_ID, sendERC20Op)
          ),
          feeTx: klaster.encodePaymentFee(feeChain.CHAIN_ID, feeToken),
        });
        const quote = await klaster.getQuote(iTx);
        const signed = await primaryWallet.getWalletClient().signMessage({
          message: {
            raw: quote.itxHash,
          },
          account: account as Address,
        });

        const result = await klaster.execute(quote, signed);

        await pb.collection("xchainshop").update(product.id, {
          state: "Reserved",
          buyer: account,
          tx: result.itxHash,
        });
        window.location.reload();
      } catch (err: any) {
        toast("Tx Error", {
          description: err.message,
        });
      }
    },
    [
      account,
      klaster,
      mUSDC,
      mcClient,
      primaryWallet,
      product,
      selectedChain,
      selectedFeeChain,
      selectedFeeToken,
    ]
  );

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
            <div>
              <div>Your Information</div>
              <div className="ml-3">
                {klasterAddress &&
                  uniq(klasterAddress).map((address, index) => {
                    return <div key={index}>AA Address: {address}</div>;
                  })}
                {chainBalances &&
                  chainBalances.map((chainBalance, index) => {
                    return (
                      <div key={index}>
                        {chainBalance.chain}: {chainBalance.balance} USDC
                      </div>
                    );
                  })}
                <div>Total USDC : {totalUSDC} USDC</div>
              </div>
            </div>

            <div>
              <div>Seller Information</div>
              <div className="ml-3">
                <div>Seller : {product.owner}</div>
                <div>Destination : {product.destination}</div>
                <div>Price : {product.price} USDC</div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-3">
                  <FormItem>
                    <FormLabel>Select Fee Chain</FormLabel>
                    <FormControl>
                      <select
                        onChange={handleFeeChainChange}
                        disabled={loading}
                      >
                        <option value="">Select a chain</option>
                        {Object.keys(CHAIN_LIST).map((chainName) => (
                          <option key={chainName} value={chainName}>
                            {CHAIN_LIST[chainName].NAME}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Select Fee Token</FormLabel>
                    <FormControl>
                      <select
                        onChange={handleFeeTokenChange}
                        disabled={loading}
                      >
                        <option value="">Select a token</option>
                        {Object.keys(FEE_TOKEN).map((token) => (
                          <option key={token} value={token}>
                            {FEE_TOKEN[token]}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                {product?.state == "Sell" && product?.owner !== account && (
                  <Button disabled={loading} className="ml-auto" type="submit">
                    Buy
                  </Button>
                )}
              </form>
            </Form>

            {product?.buyer === account && (
              <div className="flex items-center">
                {account} is bought
                <Button className="ml-3">
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

            {product?.state === "Reserved" && product?.owner === account && (
              <div className="flex space-x-4">
                <Button onClick={onApprove}>Approve</Button>
              </div>
            )}
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
