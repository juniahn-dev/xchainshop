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
        </RecoilRoot>
      </body>
    </html>
  );
}
