import { SellProduct } from "@/components/sell-product";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-20 ml-10 w-full">
      <div className="z-10 w-full max-w-md font-mono mt-10 text-white">
        <SellProduct />
      </div>
    </main>
  );
}
