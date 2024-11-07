import { Home, ScanLine, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ConnectButton } from "@particle-network/connectkit";
import { ModeToggle } from "./moon-toggle";
import Wallet from "./wallets";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Sell",
    url: "/sell",
    icon: ScanLine,
  },
  {
    title: "My",
    url: "/my",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarGroupLabel className="justify-between">
          XChainShop
          <ModeToggle />
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Wallet />
        <ConnectButton />
      </SidebarFooter>
    </Sidebar>
  );
}
