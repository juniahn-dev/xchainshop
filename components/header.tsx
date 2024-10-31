"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";

export const Header: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="z-10 w-full px-10 py-3 flex items-center justify-between font-mono text-sm">
        <Link href={"/"}>
          <h1 className="font-mono text-md font-extrabold">xchainshop</h1>
        </Link>
        <w3m-button />
      </div>

      <div className="z-10 w-full px-10 flex items-center justify-between font-mono text-sm">
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/sell");
          }}
        >
          Sell
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/my-buy");
          }}
        >
          My Buy
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/my-sell");
          }}
        >
          My Sell
        </Button>
      </div>
    </div>
  );
};
