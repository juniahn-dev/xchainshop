import { sepolia, baseSepolia } from "viem/chains";

export type Chain = {
  NAME: string;
  CHAIN: any;
  CHAIN_ID: number;
  USDC_ADDRESS: string;
  RPC_URL: string;
};

export const CHAIN_LIST: { [key: string]: Chain } = {
  SEPOLIA: {
    NAME: 'SEPOLIA',
    CHAIN: sepolia,
    CHAIN_ID: sepolia.id,
    USDC_ADDRESS: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/MVuRquu4XE6nUM1OQLUSNhiGltrtBprf",
  },
  BASE_SEPOLIA: {
    NAME: 'BASE_SEPOLIA',
    CHAIN: baseSepolia,
    CHAIN_ID: baseSepolia.id,
    USDC_ADDRESS: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    RPC_URL: "https://base-sepolia.g.alchemy.com/v2/MVuRquu4XE6nUM1OQLUSNhiGltrtBprf",
  },
};
