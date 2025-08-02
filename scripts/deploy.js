//importing hardhat runtime environment (hre)
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdFunding = await CrowdFunding.deploy();

  const contractAddress = await crowdFunding.getAddress();
  console.log("CrowdFunding deployed to: ", contractAddress);

  const envContent = `CONTRACT_ADDRESS=${contractAddress}\nALCHEMY_API_KEY=${process.env.ALCHEMY_API_KEY}\nWALLET_PRIVATE_KEY=${process.env.WALLET_PRIVATE_KEY}`;

  fs.writeFileSync('.env', envContent);
  fs.writeFileSync('./backend/.env', envContent);

  console.log("✅ Contract address updated in .env files");
  console.log("✅ Deployment complete!");
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
})