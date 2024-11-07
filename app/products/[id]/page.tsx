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
import sedaAbi from "@/seda-abi.json";
import { CHAIN_LIST } from "@/utils/chain";
import { useChain } from "@cosmos-kit/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useWallets } from "@particle-network/connectkit";
import { ethers, JsonRpcProvider } from "ethers";
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
  const [oraclePrice, setOraclePrice] = useState(0);

  // const { walletConnection, chainName: agoricChainName } = useAgoric();
  const { address: agoricAddress, getSigningStargateClient } =
    useChain("agoric");
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

  const onSubmitCosmos = useCallback(
    async (data: FormValues) => {
      if (!product) {
        return;
      }

      alert("not yet implemented");
      return;
    },
    [agoricAddress, product]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new JsonRpcProvider(
          "https://base-sepolia.g.alchemy.com/v2/MVuRquu4XE6nUM1OQLUSNhiGltrtBprf"
        );

        const contract = new ethers.Contract(
          "0xE7B0F894cEbCF283E591F94FEBB8f4c5c02fB229",
          sedaAbi,
          provider
        );

        const answer = await contract.latestAnswer();
        const amount = answer.toString().split(" ");
        setOraclePrice(amount[0] / 1000000);
      } catch (error) {
        console.error("error:", error);
      }
    };

    init();
  }, []);

  return (
    <Wrapper>
      {product ? (
        <div className="z-10 w-full  text-black space-y-5 flex gap-3">
          <div>
            <Image src={product.image} width={500} height={500} alt={""} />
          </div>
          <div className="flex flex-col gap-6 px-3">
            <Badge
              variant="outline"
              className={`flex items-center ${
                product.state === "Sell"
                  ? "bg-green-200 text-green-900"
                  : "bg-gray-200 text-gray-600"
              } font-medium  border-none rounded-xl px-2 py-1 w-[90px]`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  product.state === "Sell" ? "bg-green-700" : "bg-gray-600"
                }`}
              ></span>
              {product.state === "Sell" ? "For Sale" : "Reserved"}
            </Badge>
            <h1 className="text-2xl font-extrabold text-black dark:text-white">
              {product.name}
            </h1>
            <span className="border-b border-gray-400 h-px w-full"></span>
            <h1 className="text-bold text-2xl text-black dark:text-white">
              About Product
            </h1>
            <h1 className="text-black dark:text-white">
              {product.description}
            </h1>
            <span className="border-b border-gray-400 h-px w-full"></span>
            <h1 className="text-bold text-2xl text-black dark:text-white">
              Price
            </h1>
            <h1 className="text-black dark:text-white">
              {product.price} USDC ({product.destination}]
            </h1>
            <p className="text-black dark:text-white">
              Oracle Price : {oraclePrice} USDC
            </p>
            <span className="border-b border-gray-400 h-px w-full"></span>
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-black dark:text-white text-lg">
                Current Balance
              </h1>
              <p className="text-black dark:text-white">{totalUSDC} USDC</p>
            </div>
            {product?.state == "Sell" &&
              product.destination.includes("SEPOLIA") &&
              product?.owner !== account && (
                <div className="space-y-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full space-y-8"
                    >
                      <div className="space-y-3 flex flex-col gap-3 py-2">
                        <FormItem className="flex gap-3 items-center">
                          <FormLabel className=" text-black dark:text-white">
                            Select Fee Chain
                          </FormLabel>
                          <FormControl>
                            <select
                              onChange={handleFeeChainChange}
                              disabled={loading}
                              className="text-black dark:text-white"
                            >
                              <option
                                value=""
                                className="text-black dark:text-white"
                              >
                                Select a chain
                              </option>
                              {Object.keys(CHAIN_LIST).map((chainName) => (
                                <option key={chainName} value={chainName}>
                                  {CHAIN_LIST[chainName].NAME}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormItem className="flex gap-3 items-center">
                          <FormLabel className="text-black dark:text-white">
                            Select Fee Token
                          </FormLabel>
                          <FormControl>
                            <select
                              onChange={handleFeeTokenChange}
                              disabled={loading}
                              className="text-black dark:text-white"
                            >
                              <option
                                value=""
                                className="text-black dark:text-white"
                              >
                                Select a token
                              </option>
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
                      <Button
                        disabled={loading}
                        className="ml-auto bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-3xl w-full py-6 text-xl font-bold"
                        type="submit"
                      >
                        Buy
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            {product?.state == "Sell" &&
              product.destination.includes("SEPOLIA") === false &&
              product?.owner !== account && (
                <div className="space-y-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmitCosmos)}
                      className="w-full space-y-8"
                    >
                      <Button
                        disabled
                        className="ml-auto bg-purple-600 text-white hover:bg-purple-700 py-2 px-4 rounded-3xl w-full py-6 text-xl font-bold"
                        type="submit"
                      >
                        Buy
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

            {/* <div>
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
            </div> */}

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
            {product?.state === "Reserved" && product?.owner === account && (
              <div className="flex space-x-4 text-black dark:text-white">
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
