//importing hardhat runtime environment (hre)
const hre = require("hardhat");

async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdFunding = await CrowdFunding.deploy();


  console.log("CrowdFunding deployed to: ", await crowdFunding.getAddress());

}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
})