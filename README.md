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
- **Limited Existing Platforms**: Overseas second-hand services are scarce, and those available often lack support for diverse payment methods, limiting accessibility for many users.

- **Absence of Localized, Low-Cost Payment Options**: Conventional local payment methods, such as cash or credit card, often incur high fees around 10%. Xchain Shop addresses this by introducing cryptocurrency payments, allowing users to enjoy significantly lower transaction fees, approximately 2-3%.

- **Transaction Security Issues**: Many users are hesitant to engage in second-hand transactions due to potential scams. Xchain Shop plans to incorporate safety mechanisms, such as escrow, to provide a secure transaction environment.

- **Lack of User Convenience**: The platform is designed with a streamlined UX, making it easy for anyone to list, browse, and purchase items, ensuring a smooth and intuitive transaction process.

# Solution
1. **Accurate Price Verification with SEDA Oracle**  
   - Xchain Shop leverages the SEDA oracle to provide accurate, consistent pricing for products listed on the platform. Whenever a product is registered or modified, its current price is automatically updated in the oracle. This ensures that the price displayed at the time of purchase is verified and reliable, adding transparency and trust to the transaction process.

2. **Flexible Cross-Chain Payment Options with Agoric and Klaster**  
   - Xchain Shop supports multi-chain payments, allowing users to pay with USDC across multiple blockchain ecosystems. Using **Klaster’s Account Abstraction (AA) wallet**, users can transfer assets securely on EVM-compatible networks, finding the most efficient route for cross-chain transactions. Although full integration with **Agoric Orchestration** for Cosmos was not completed, the platform is designed to enable Cosmos IBC payments in the future. This approach enhances payment flexibility and ensures compatibility with various blockchain networks, making transactions both secure and versatile.

3. **User Accessibility through Particle Connect**  
   - **Particle Connect** integration allows users to easily access Xchain Shop using multiple wallets or social logins (e.g., email or social media accounts). This feature reduces barriers to entry and makes the platform accessible to users of all levels, with options to purchase and exchange USDC through Fiat On Ramp and token swap functionalities. This simplifies the onboarding process and enhances convenience for users engaging in second-hand transactions.

4. **Secure Transaction Process with Escrow**  
   - Xchain Shop prioritizes transaction safety by implementing escrow services for P2P exchanges. This security measure protects both buyers and sellers, addressing common concerns about scams in the second-hand market and ensuring a trustworthy environment for transactions.

5. **Streamlined, Intuitive User Experience**  
   - The platform is designed with a simple, intuitive interface that allows users to quickly list items, view available products, and make purchases. By keeping processes straightforward and user-friendly, Xchain Shop ensures that anyone can easily engage in buying or selling second-hand items.

6. **Local Community-Based Trading with GPS Functionality**  
   - Xchain Shop leverages GPS-based local trading, making it easier for users to find and purchase items within their community. This feature fosters a community-oriented marketplace and encourages trust among users by facilitating nearby exchanges.

### Summary
Xchain Shop combines oracle-verified pricing, cross-chain payment support, secure escrow, and an easy onboarding experience to deliver a comprehensive, community-focused platform for second-hand transactions. The solution emphasizes accessibility, security, and flexibility, enabling users to engage in local P2P transactions with ease and confidence.

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
