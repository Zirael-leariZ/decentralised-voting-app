import React, { createContext, useContext, useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define MetaMask provider interface that matches the actual MetaMask provider
interface MetaMaskProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (data: any) => void) => void;
  removeListener: (event: string, callback: (data: any) => void) => void;
  isMetaMask?: boolean;
}

// Define types
interface MetaMaskContextType {
  account: string | null;
  provider: MetaMaskProvider | null;
  isConnected: boolean;
  chainId: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (targetChainId: string) => Promise<void>;
}

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export const useMetaMask = (): MetaMaskContextType => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};

export const MetaMaskProvider: React.FC<MetaMaskProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<MetaMaskProvider | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const checkIfWalletIsConnected = async (): Promise<void> => {
    try {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        const metamaskProvider = detectedProvider as unknown as MetaMaskProvider;
        setProvider(metamaskProvider);
        const accounts: string[] = await metamaskProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          const chainId: string = await metamaskProvider.request({ method: 'eth_chainId' });
          setChainId(chainId);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const detectedProvider = await detectEthereumProvider();
      
      if (!detectedProvider) {
        alert('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      const metamaskProvider = detectedProvider as unknown as MetaMaskProvider;
      const accounts: string[] = await metamaskProvider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setProvider(metamaskProvider);
        setAccount(accounts[0]);
        setIsConnected(true);
        const chainId: string = await metamaskProvider.request({ method: 'eth_chainId' });
        setChainId(chainId);
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        alert('Please connect to MetaMask to continue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = (): void => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    setChainId(null);
  };

  const switchNetwork = async (targetChainId: string): Promise<void> => {
    try {
      if (provider) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const setupEventListeners = async (): Promise<void> => {
    const detectedProvider = await detectEthereumProvider();
    if (detectedProvider) {
      const metamaskProvider = detectedProvider as unknown as MetaMaskProvider;
      metamaskProvider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      metamaskProvider.on('chainChanged', (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });
    }
  };

  const value: MetaMaskContextType = {
    account,
    provider,
    isConnected,
    chainId,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
};