# 🪙 CrowdFunding DApp

A decentralized crowdfunding platform built on Ethereum using Solidity, Hardhat, and a React-based frontend. This DApp allows users to create crowdfunding campaigns, contribute ETH to projects, and enables campaign creators to claim funds if the target is met or refund contributors otherwise.

---

## 🚀 Features

- ✅ Deployable on local or testnet (e.g., Sepolia)
- ✅ Campaign creation with title, description, goal, and deadline
- ✅ Real-time pledge tracking
- ✅ ETH contributions from multiple users via MetaMask
- ✅ Automatic handling of goal deadline and fund withdrawal
- ✅ Refunds to users if campaign goals aren't met
- ✅ Fully decentralized logic — all core actions handled by smart contract

---

## 🏗️ Tech Stack

| Layer       | Tools & Libraries                        |
|-------------|------------------------------------------|
| Blockchain  | Solidity, Hardhat, Ethers.js, OpenZeppelin |
| Frontend    | React, Vite, TailwindCSS, Ethers.js      |
| Wallet      | MetaMask                                 |
| Versioning  | Git + GitHub                             |

---

## 📦 Project Structure

```bash
crowdfunding-dapp/
├── client/                  # React frontend
├── contracts/               # Solidity smart contracts
├── scripts/                 # Hardhat deployment & interaction scripts
├── test/                    # Unit tests for contracts
├── hardhat.config.js        # Hardhat configuration
└── README.md                # You're here
