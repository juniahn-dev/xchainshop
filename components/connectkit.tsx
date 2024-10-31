"use client";

// Particle imports
import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import { EntryPosition, wallet } from "@particle-network/connectkit/wallet";

import { sepolia } from "@particle-network/connectkit/chains";
import React from "react";

const config = createConfig({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,

  appearance: {
    recommendedWallets: [
      { walletId: "metaMask", label: "Recommended" },
      { walletId: "coinbaseWallet", label: "popular" },
    ],
    language: "en-US",
    mode: "auto",
  },

  walletConnectors: [
    evmWalletConnectors({
      metadata: {
        name: "XChainShop",
        icon:
          typeof window !== "undefined"
            ? `${window.location.origin}/favicon.ico`
            : "",
        description: "XChainShop",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
      walletConnectProjectId: process.env
        .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    }),

    authWalletConnectors({
      authTypes: ["email", "google", "twitter", "github"],
    }),
  ],

  plugins: [
    wallet({
      visible: true,
      entryPosition: EntryPosition.BR,
    }),
  ],

  chains: [sepolia],
});

export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
