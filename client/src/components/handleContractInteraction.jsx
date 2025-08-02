import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useEthereum } from '../context/EthereumContext';

// Contract interaction functions
async function launchCampaign(contract) {
  try {
    if (!contract) throw new Error("Contract not available");

    // Launch campaign with sample values: 1 ETH goal, 30 days duration
    const tx = await contract.launch(
      ethers.parseEther("1"),
      30 * 24 * 60 * 60 // 30 days in seconds
    );
    await tx.wait();

    console.log("Campaign launched successfully:", tx);
    alert("Campaign launched successfully!");
  } catch (error) {
    console.error("Error launching campaign:", error);
    alert("Failed to launch campaign: " + error.message);
  }
}

async function pledgeToCampaign(contract) {
  try {
    if (!contract) throw new Error("Contract not available");

    // Pledge to campaign ID 1 with 0.1 ETH
    const tx = await contract.pledge(1, {
      value: ethers.parseEther("0.1")
    });
    await tx.wait();

    console.log("Pledged successfully:", tx);
    alert("Pledged successfully!");
  } catch (error) {
    console.error("Error pledging:", error);
    alert("Failed to pledge: " + error.message);
  }
}

export default function HandleContractInteraction() {
  const { metaMaskEnabled, contractDetails, signer, initEthereum } = useEthereum();
  const [isConnecting, setIsConnecting] = useState(false);

  // Show connect wallet button if MetaMask is not enabled
  if (!metaMaskEnabled) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-600">Please connect your wallet to continue</p>
        <WalletInitiate initEthereum={initEthereum} isConnecting={isConnecting} setIsConnecting={setIsConnecting} />
      </div>
    );
  }

  // Show loading if contract details are not available
  if (!contractDetails.contractAddress || !contractDetails.contractABI) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-yellow-600">Loading contract details...</p>
      </div>
    );
  }

  // Create contract instance
  const contract = new ethers.Contract(
    contractDetails.contractAddress,
    contractDetails.contractABI,
    signer
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-green-600">Wallet connected successfully!</p>
      <div className="flex gap-4">
        <LaunchButton contract={contract} />
        <PledgeButton contract={contract} />
      </div>
    </div>
  );
}

function WalletInitiate({ initEthereum, isConnecting, setIsConnecting }) {
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await initEthereum();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      className="border-2 rounded-md px-4 py-2 cursor-pointer bg-blue-400 text-white hover:bg-blue-500 active:scale-95 transition-all duration-200 disabled:opacity-50"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}

function LaunchButton({ contract }) {  // ✅ Fixed return statement
  return (
    <button
      className="border-2 rounded-md px-4 py-2 cursor-pointer bg-blue-400 text-white hover:bg-blue-500 active:scale-95 transition-all duration-200"
      onClick={() => launchCampaign(contract)} // ✅ Fixed function call
    >
      Launch Campaign
    </button>
  );
}

function PledgeButton({ contract }) {  // ✅ Fixed function definition
  return (
    <button
      className="border-2 rounded-md px-4 py-2 cursor-pointer bg-green-400 text-white hover:bg-green-500 active:scale-95 transition-all duration-200"
      onClick={() => pledgeToCampaign(contract)} // ✅ Fixed function call
    >
      Pledge to Campaign
    </button>
  );
}