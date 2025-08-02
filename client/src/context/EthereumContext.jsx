import axios from 'axios';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';

export const EthereumContext = createContext();

export const EthereumProvider = ({ children }) => {
  const [metaMaskEnabled, setMetaMaskEnabled] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    contractAddress: '',
    contractABI: [],
  });
  const [signer, setSigner] = useState(null);
  const [userAccount, setUserAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false); // ✅ Add connection state
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Add initialization state

  async function initEthereum() {
    // ✅ Prevent multiple simultaneous connection attempts
    if (isConnecting || metaMaskEnabled) {
      console.log("Connection already in progress or wallet already connected");
      return;
    }

    setIsConnecting(true);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // ✅ Check if already connected first
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length === 0) {
        // ✅ Only request accounts if not already connected
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }

      setMetaMaskEnabled(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      setUserAccount(await signer.getAddress());

      // ✅ Fetch contract details
      const response = await axios.get('http://localhost:5000/api/contracts');
      const { contractAddress, contractABI } = response.data;

      if (!contractAddress || !contractABI) {
        throw new Error("Contract details are not available from server");
      }

      setContractDetails({ contractAddress, contractABI });
      setIsInitialized(true);

    } catch (error) {
      console.error("Error initializing Ethereum:", error);

      // ✅ Handle specific MetaMask errors
      if (error.code === -32002) {
        alert("MetaMask connection request is already pending. Please check MetaMask and try again.");
      } else if (error.code === 4001) {
        alert("Please connect your MetaMask wallet to continue.");
      } else {
        alert("Failed to initialize wallet: " + error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  }

  // ✅ Auto-check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && !isInitialized) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Already connected, initialize without requesting accounts
            await initEthereum();
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };

    checkConnection();
  }, [isInitialized]);

  // ✅ Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setMetaMaskEnabled(false);
          setSigner(null);
          setUserAccount('');
          setContractDetails({ contractAddress: '', contractABI: [] });
          setIsInitialized(false);
        } else {
          // Account changed, reinitialize
          initEthereum();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <EthereumContext.Provider value={{
      metaMaskEnabled,
      contractDetails,
      signer,
      userAccount,
      initEthereum,
      isConnecting // ✅ Expose connection state
    }}>
      {children}
    </EthereumContext.Provider>
  );
}

export const useEthereum = () => {
  const content = useContext(EthereumContext);
  if (!content) {
    throw new Error('useEthereum must be used within EthereumProvider');
  }
  return content;
}