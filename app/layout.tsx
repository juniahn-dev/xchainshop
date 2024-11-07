// app/layout.tsx
"use client";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Web3ModalProvider from "@/context";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { RecoilRoot } from "recoil";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <RecoilRoot>
          <ChainProvider
            chains={chains} // supported chains
            assetLists={assets} // supported asset lists
            wallets={wallets} // supported wallets
          >
            <Web3ModalProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarTrigger />
                  {children}
                </SidebarProvider>
              </ThemeProvider>
            </Web3ModalProvider>
          </ChainProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
