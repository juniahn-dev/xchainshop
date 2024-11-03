import { isNil } from "ramda";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const balanceState = atom<number>({
  key: "Balance",
  default: 0,
});

export const useBalance = (initValue?: number) => {
  const [balance, setBalance] = useRecoilState(balanceState);

  useEffect(() => {
    !isNil(initValue) && setBalance(initValue);
  }, [initValue]);

  return {
    balance,
    setBalance,
  };
};
