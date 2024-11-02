import { SellProduct } from "@/components/sell-product";
import { Wrapper } from "@/components/wrapper";

export default function Home() {
  return (
    <Wrapper>
      <div className="z-10 w-full max-w-md font-mono mt-10 text-white">
        <SellProduct />
      </div>
    </Wrapper>
  );
}
