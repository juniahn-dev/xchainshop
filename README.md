# [Xchain shop](https://xchainshop.vercel.app/)

The Simple | Low | Re-Cycle Envirorment.

Xchain Shop is Re-Commerce Platform.
- [Xchainshop Deck](https://www.canva.com/design/DAGVlSR0wkA/6xGTcVe_KUxmqTbo_LaCuA/edit?utm_content=DAGVlSR0wkA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) | [Demo video](https://youtu.be/dK1H0B30Nf4)

### Smart Contract
- [Particle Connect](https://github.com/juniahn-dev/xchainshop/blob/main/components/connectkit.tsx) | [Klaster Contract](https://github.com/juniahn-dev/xchainshop/blob/main/app/products/%5Bid%5D/page.tsx#L206) | [Agoric Contract](https://github.com/juniahn-dev/xchainshop/tree/main/orchestration) | [SEDA Contract](https://github.com/soaryong/seda-request-starter-kit)

# Background
Xchain shop is a second-hand transaction service that is not widely used in overseas environments and is not yet active, but it would be good to utilize this in reverse to enter this blue ocean-like second-hand transaction P2P transaction platform for the first time and participate in a market where there is a lack of competitors, effectively and uniquely show our own service, and activate this P2P transaction a little more, and provide a way for users to easily make profits and resell various leftover products that are too good to throw away or new but unused products to make a little profit, or to quickly obtain necessary items from people and areas around them.

Therefore, rather than focusing on fundamental issues, we have seen a successful case in the Korean market where a GPS-based second-hand transaction service called Carrot Market was successful and well-operated, so this second-hand transaction service is being provided to introduce a cryptocurrency payment system in overseas markets, to be reborn, to challenge the overseas second-hand transaction market, and to help users easily purchase and obtain necessary products around them.

- **Sellers** simply write and upload the product name, description, price, image, and transaction details they want to sell.
- **Buyers** simply check the list of products they need and purchase them with cryptocurrency.

The payment method is cryptocurrency, and stable coins can be used for payment. In addition, since it provides multi-chain, it allows payments to be made regardless of the network.

# Problem
- **Limited Payment Flexibility in Overseas Second-Hand Platforms**:
   - Traditional second-hand marketplaces are limited in payment options, often restricted to local methods like cash and credit cards. High fees (up to 10%) are common with traditional payment processors, creating a barrier for cost-sensitive users. Xchain Shop addresses this by introducing **cryptocurrency payments** with lower fees (around 2-3%) and cross-chain capabilities, making transactions more affordable and accessible.

- **Lack of Security in Peer-to-Peer Transactions**:
   - Many users hesitate to engage in second-hand transactions due to fears of scams and lack of secure transaction systems. Xchain Shop mitigates this by incorporating **escrow services** to protect both buyers and sellers, ensuring that payment is only released when both parties are satisfied with the transaction.

- **Complex and Unfriendly User Experience**:
   - Current platforms often have complicated registration and product listing processes, making it difficult for users to engage in quick transactions. Xchain Shop simplifies this process by providing an **intuitive, user-friendly interface** with easy onboarding through social login options, enabling anyone to quickly list or purchase items.

- **Limited Access to Community-Based, Local Transactions**:
   - Users often want to buy and sell items within their local community but face limitations in finding reliable platforms that support nearby transactions. Xchain Shop leverages **GPS-based functionality** to promote local, community-driven exchanges, fostering a safe and trusted environment for users to connect with others nearby.

# Our Target
- **Frequent Buyers and Sellers in Overseas Markets**:
   - Travelers, expatriates, and foreign residents who need convenient ways to buy and sell items, often with fewer local connections or without access to local payment methods.
   
- **Young, Tech-Savvy Users**:
  - Individuals who are comfortable with digital currencies and appreciate lower transaction fees and the flexibility that comes with cryptocurrency payments.

- **Community-Oriented Shoppers**:
   - People who prefer local, community-based marketplaces and want a safe, trusted environment to trade second-hand goods.

- **Cost-Sensitive Consumers**:
   - Users who want to avoid high transaction fees associated with traditional payment methods and value a platform offering cheaper alternatives through cryptocurrency options.

Xchain Shop is designed to address these key issues by providing a secure, accessible, and community-focused platform that enables smooth, cost-effective transactions for users worldwide.

# Solution
1. **Seamless Multi-Network Payments with Klaster**  
   - By integrating **Klaster** for AA (Account Abstraction) wallet support, Xchain Shop enables users to transact across multiple blockchain networks effortlessly. This means users can pay with **`USDC or other supported stablecoins`** on various chains, without worrying about compatibility or network-specific barriers. It simplifies the payment process and reduces friction, providing a truly **`multi-chain payment option`** that stands out from traditional, single-network solutions.

2. **Cross-Ecosystem Support Using Agoric for Cosmos IBC Integration**  
   - Xchain Shop goes beyond the EVM ecosystem by incorporating **`Agoric Orchestration`** to support Cosmos’s **`IBC (Inter-Blockchain Communication) ecosystem`**. This unique integration allows us to extend USDC payments to the Cosmos network, enabling seamless P2P transactions across both EVM and Cosmos ecosystems. Users can now benefit from an interconnected network of blockchains, enjoying both flexibility and choice in payment methods. This sets Xchain Shop apart by making it compatible with a broader range of ecosystems and expanding access for users.

3. **Easy User Onboarding and Enhanced Convenience with Particle Connect**  
   - With **`Particle Connect SDK`**, we make it easy for anyone to join Xchain Shop through **`social login options`** (e.g., email, social media accounts) and a streamlined wallet integration. This reduces the barrier to entry, allowing non-crypto-savvy users to participate in the marketplace without needing extensive setup. They can conveniently access multi-wallet functions and connect to the ecosystem, even using Fiat On Ramp for USDC purchases and swaps within the platform.
  
4. **Accurate and Transparent Pricing with SEDA Oracle**
   - Ensures **`up-to-date product pricing`** by periodically registering product price information through the SEDA oracle when products are listed or updated.
Uses SEDA to confirm pricing accuracy at the time of purchase, adding a layer of transparency. Additionally, the oracle identifies top users by ranking, awarding them directly through the contract, encouraging active engagement and rewarding trustworthy users.

### Summary
By combining **Klaster, Agoric, Particle Connect, and SEDA Oracle**, Xchain Shop offers a cross-chain, user-friendly, and accurate marketplace experience, positioning it as a leading solution in the global P2P second-hand market.

# How to use the Bountie Tracks
### [SEDA](https://github.com/soaryong/seda-request-starter-kit) 
- When transmitting product information through an external API, the current price information of the product is uploaded to the oracle to provide the same price information. Price information is periodically registered in the oracle in the backend when a product is registered or modified, and the information is used to check whether the price is accurate when purchasing a product.
- The SEDA oracle raises the address of the highest-ranking user and rewards that user in the contract.

### [Agoric Orchestration](https://github.com/juniahn-dev/xchainshop/tree/main/orchestration)
- We tried to link Argoric Orchestration for Cosmos USDC payment. The linkage failed due to lack of time (library setting issue), but we tried to implement the abstraction of the Cosmos side chain. 

### [Particle Connect](https://github.com/juniahn-dev/xchainshop/blob/main/components/connectkit.tsx)
- We were able to easily link and utilize multiple wallets/social logins, etc. We were not able to test it because it is not the mainnet, but you can purchase and exchange USDC tokens used in XChainShop with Fiat On Ramp/Swap, etc. 

### [Klaster](https://github.com/juniahn-dev/xchainshop/blob/main/app/products/%5Bid%5D/page.tsx#L206)
- We used the AA wallet to easily transfer assets on multiple chains and utilize contracts on multiple chains. It made it possible to pay USDC on interchains through the optimal route.

# Key Features
1. **Cryptocurrency Payment System**
   - Supports stablecoins and multiple blockchains, enabling users to make secure and affordable transactions with fees as low as 2-3%.

2. **Cross-Chain Compatibility**
   - Utilizes **Klaster** for EVM-compatible networks and **Agoric** for Cosmos IBC networks, allowing seamless transactions with USDC across different ecosystems.

3. **User-Friendly Access**
   - With **Particle Connect SDK**, users can easily sign up using email or social media, making the platform accessible and straightforward.

4. **Enhanced Security with Escrow**
   - Escrow services ensure secure transactions, protecting users against scams in P2P second-hand trades.

5. **Intuitive UX for Quick Transactions**
   - Simple listing and purchasing processes with an easy-to-navigate interface, allowing users to quickly post items and make purchases.

6. **GPS-Based Local Trading**
   - Facilitates location-based transactions so users can find and purchase items within their local community, promoting trust and convenience.

<details>
<summary>
  Getting Started
</summary>
<div markdown="1">
  
  This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
  
  ## Getting Started
  
  First, run the development server:
  
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```
  
  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
  
  You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
  
  This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
  
  ## Learn More
  
  To learn more about Next.js, take a look at the following resources:
  
  - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
  - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
  
  You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
  
  ## Deploy on Vercel
  
  The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
  
  Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details..

</div>
</details>
