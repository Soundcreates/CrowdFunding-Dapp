import { ethers } from "ethers";
import CrowdFundingABI from "./Crowdfunding.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getCrowdfundingContract() {
  //check if the user has a wallet connected
  if (!window.ethereum) throw new Error("wallet not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI, signer);

  return contract;
}