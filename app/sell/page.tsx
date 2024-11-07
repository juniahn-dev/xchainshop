import { SellProduct } from "@/components/sell-product";
import { Wrapper } from "@/components/wrapper";

export default function Home() {
  return (
    <Wrapper>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 ">Sell Product</h1>
        <SellProduct />
      </div>
    </Wrapper>
  );
}
