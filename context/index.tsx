// context/index.tsx

"use client";

import { ParticleConnectkit } from "@/components/connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Setup queryClient
const queryClient = new QueryClient();

export default function Web3ModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ParticleConnectkit>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ParticleConnectkit>
  );
}
