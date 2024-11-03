"use client"

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Address, createWalletClient, custom, encodeFunctionData, erc20Abi, formatUnits, parseUnits } from 'viem';
import {arbitrumSepolia, baseSepolia, sepolia} from 'viem/chains';
import { acrossBridgePlugin } from '@/plugin/acrossBridgePlugin';
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
    singleTx
} from 'klaster-sdk';
import {useAccount, useAddress, useWallets} from "@particle-network/connectkit";

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
};

const SEPOLIA = {
    NAME: 'SEPOLIA',
    CHAIN: sepolia,
    CHAIN_ID: sepolia.id,
    USDC_ADDRESS: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as Address,
};

const BASE_SEPOLIA = {
    NAME: 'BASE_SEPOLIA',
    CHAIN: baseSepolia,
    CHAIN_ID: baseSepolia.id,
    USDC_ADDRESS: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
};


const CHAIN_LIST: { [key: string]: Chain } = {
    SEPOLIA: SEPOLIA,
    BASE_SEPOLIA: BASE_SEPOLIA,
};

const FEE_TOKEN: { [key: string]: string } = {
    ETH: "ETH",
    USDC: "USDC",
};

const Klaster = () => {
    const [klaster, setKlaster] = useState<KlasterSDK<BiconomyV2AccountInitData> | null>(null);
    const [mUSDC, setMUSDC] = useState<any | null>(null);
    const [mcClient, setMcClient] = useState<any | null>(null);
    const [klasterAddress, setKlasterAddress] = useState<any[] | null>(null);
    const [totalUSDC, setTotalUSDC] = useState<string | null>(null);
    const [chainBalances, setChainBalances] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [selectedFeeChain, setSelectedFeeChain] = useState<Chain | null>(null);
    const [selectedFeeToken, setSelectedFeeToken] = useState<string | null>(null);
    const { address, isConnected } = useAccount();
    const [primaryWallet] = useWallets();

    const getChainNameById = (chainId: number): string | undefined => {
        const chain = Object.values(CHAIN_LIST).find(chain => chain.CHAIN_ID === chainId);
        return chain ? chain.NAME : undefined;
    };

    useEffect(() => {
        const init = async () => {
            const signer = createWalletClient({
                transport: custom((window as any).ethereum),
            });
            if(!address) return;


            console.log('address :', address);

            const klasterInit = await initKlaster({
                accountInitData: loadBicoV2Account({
                    owner: address as Address,
                }),
                nodeUrl: klasterNodeHost.default,
            });

            const mcClient = buildMultichainReadonlyClient(
                Object.values(CHAIN_LIST).map((chain) => {
                    return {
                        chainId: chain.CHAIN_ID,
                        rpcUrl: chain.CHAIN.rpcUrls.default.http[0],
                    };
                })
            );
            const mcUSDC = buildTokenMapping(
                Object.values(CHAIN_LIST).map(chain => deployment(chain.CHAIN_ID, chain.USDC_ADDRESS))
            );

            const uBalance = await mcClient.getUnifiedErc20Balance({
                tokenMapping: mcUSDC,
                account: klasterInit.account,
            });
            console.log('uBalance :', uBalance);
            console.log(uBalance.breakdown);
            const totalUSDC = formatUnits(uBalance.balance, uBalance.decimals);
            const chainBalances = uBalance.breakdown.map(balance => {
                return {
                    chain: getChainNameById(balance.chainId),
                    balance: formatUnits(balance.amount, uBalance.decimals),
                };
            });

            const klasterAddress = klasterInit.account.getAddresses(Object.values(CHAIN_LIST).map(chain => chain.CHAIN_ID));
            console.log('Klaster Init', klasterAddress);

            setTotalUSDC(totalUSDC);
            setChainBalances(chainBalances);
            setKlasterAddress(klasterAddress);
            setKlaster(klasterInit);
            setMUSDC(mcUSDC);
            setMcClient(mcClient);
            setLoading(false);
        };

        init();
    }, [address]);

    const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const chainName = event.target.value;
        const chain = CHAIN_LIST[chainName as keyof typeof CHAIN_LIST];
        setSelectedChain(chain);
    };
    const handleFeeChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const chainName = event.target.value;
        const chain = CHAIN_LIST[chainName as keyof typeof CHAIN_LIST];
        setSelectedFeeChain(chain);
    }
    const handleFeeTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const feeToken = event.target.value;
        setSelectedFeeToken(feeToken);
    }

    const onSubmit = async (data: FormValues) => {
        if (!klaster) {
            return;
        }

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
            amount: parseUnits(data.amount.toString(), uBalance.decimals),
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
                functionName: 'transfer',
                args: [data.recipient as Address, bridgingOps.totalReceivedOnDestination],
            }),
        });

        const iTx = buildItx({
            steps: bridgingOps.steps.concat(singleTx(destinationChain.CHAIN_ID, sendERC20Op)),
            feeTx: klaster.encodePaymentFee(feeChain.CHAIN_ID, feeToken),
        });
        console.log('iTx :', iTx);
        const quote = await klaster.getQuote(iTx);
        console.log('address :', address);
        const signed = await  primaryWallet.getWalletClient().signMessage({
            message: {
                raw: quote.itxHash,
            },
            account: address as Address,
        });

        const result = await klaster.execute(quote, signed);
        console.log(result.itxHash);
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipient: '0x1F1166E75C322B5442A41a72E6A057c2A39B44Ee',
            amount: 10,
        },
    });

    return (
        <div>
            {klasterAddress && klasterAddress.map((address, index) => {
                return <p key={index}>{address}</p>;
            })}
            <p>Total USDC: {totalUSDC}</p>
            {chainBalances && chainBalances.map((chainBalance, index) => {
                return <p key={index}>{chainBalance.chain}: {chainBalance.balance}</p>;
            })}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="recipient" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="amount" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Destination Chain</FormLabel>
                            <FormControl>
                                <select onChange={handleChainChange} disabled={loading}>
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
                            <FormLabel>Select Fee Chain</FormLabel>
                            <FormControl>
                                <select onChange={handleFeeChainChange} disabled={loading}>
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
                                <select onChange={handleFeeTokenChange} disabled={loading}>
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
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Transfer
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Klaster;
