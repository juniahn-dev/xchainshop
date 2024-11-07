"use client";

import { useChain } from "@cosmos-kit/react";
import { Button } from "./ui/button";
import { ellipsisAddress } from "@/utils/strings";

export default function Wallet() {
  const { chain, status, address, openView } = useChain("agoric");
  return (
    <Button onClick={openView}>
      {status === "Connected" ? (
        <>{ellipsisAddress(address)}</>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  );
}
