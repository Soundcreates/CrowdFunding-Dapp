import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthereum } from '../context/EthereumContext';
import CampaignList from './CampaignList';

// Contract interaction functions with proper parameter order
async function launchCampaign(contract, setCampaigns) {
  try {
    if (!contract) throw new Error("Contract not available");

    const campaignName = "Sample Campaign";
    const goal = ethers.parseEther("1");
    const duration = 30 * 24 * 60 * 60; // 30 days in seconds

    // ✅ Correct parameter order: _goal, _duration, name
    const tx = await contract.launch(goal, duration, campaignName);
    await tx.wait();

    console.log("Campaign launched successfully:", tx);
    alert("Campaign launched successfully!");

    // ✅ Get the campaign count and fetch the new campaign
    const count = await contract.count();
    const campaign = await contract.getCampaign(count);

    const newCampaign = {
      id: count,
      name: campaignName,
      goal: goal,
      creator: campaign.creator,
      pledged: campaign._pledged,
      startAt: campaign.startAt,
      endAt: campaign.endAt,
      claimed: campaign._claimed
    };

    setCampaigns(prev => [...prev, newCampaign]);
  } catch (error) {
    console.error("Error launching campaign:", error);
    alert("Failed to launch campaign: " + error.message);
  }
}

async function pledgeToCampaign(contract) {
  try {
    if (!contract) throw new Error("Contract not available");

    // ✅ Check if campaign exists first
    const count = await contract.count();
    if (count === 0n) {
      throw new Error("No campaigns available. Please launch a campaign first.");
    }

    // Pledge to the latest campaign with 0.1 ETH
    const tx = await contract.pledge(count, {
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

// ✅ Function to fetch all campaigns
async function fetchCampaigns(contract) {
  try {
    const count = await contract.count();
    const campaigns = [];

    for (let i = 1; i <= count; i++) {
      const campaign = await contract.getCampaign(i);
      campaigns.push({
        id: i,
        name: `Campaign ${i}`, // You might want to store names separately
        goal: campaign.goal,
        creator: campaign.creator,
        pledged: campaign._pledged,
        startAt: campaign.startAt,
        endAt: campaign.endAt,
        claimed: campaign._claimed
      });
    }

    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

export default function HandleContractInteraction() {
  const { metaMaskEnabled, contractDetails, signer, initEthereum, userAccount } = useEthereum();
  const [isConnecting, setIsConnecting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch campaigns when contract is available
  useEffect(() => {
    if (contractDetails.contractAddress && contractDetails.contractABI && signer) {
      const contract = new ethers.Contract(
        contractDetails.contractAddress,
        contractDetails.contractABI,
        signer
      );

      const loadCampaigns = async () => {
        setIsLoading(true);
        const existingCampaigns = await fetchCampaigns(contract);
        setCampaigns(existingCampaigns);
        setIsLoading(false);
      };

      loadCampaigns();
    }
  }, [contractDetails, signer]);

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
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-blue-500">
          <span className="font-bold text-black">Wallet Address:</span> {userAccount}
        </h1>
        <div className="flex gap-4 flex-wrap">
          <LaunchButton contract={contract} setCampaigns={setCampaigns} />
          <PledgeButton contract={contract} />
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading campaigns...</p>
        ) : (
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Active Campaigns</h2>
            {campaigns.length === 0 ? (
              <p className="text-gray-600">No campaigns available. Launch one to get started!</p>
            ) : (
              <CampaignList campaigns={campaigns} />
            )}
          </div>
        )}
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

function LaunchButton({ contract, setCampaigns }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await launchCampaign(contract, setCampaigns);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <button
      className="border-2 rounded-md px-4 py-2 cursor-pointer bg-blue-400 text-white hover:bg-blue-500 active:scale-95 transition-all duration-200 disabled:opacity-50"
      onClick={handleLaunch}
      disabled={isLaunching}
    >
      {isLaunching ? "Launching..." : "Launch Campaign"}
    </button>
  );
}

function PledgeButton({ contract }) {
  const [isPledging, setIsPledging] = useState(false);

  const handlePledge = async () => {
    setIsPledging(true);
    try {
      await pledgeToCampaign(contract);
    } finally {
      setIsPledging(false);
    }
  };

  return (
    <button
      className="border-2 rounded-md px-4 py-2 cursor-pointer bg-green-400 text-white hover:bg-green-500 active:scale-95 transition-all duration-200 disabled:opacity-50"
      onClick={handlePledge}
      disabled={isPledging}
    >
      {isPledging ? "Pledging..." : "Pledge to Campaign"}
    </button>
  );
}