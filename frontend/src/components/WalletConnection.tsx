import React from 'react';
import { useMetaMask } from '../context/MetaMaskContext';

const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isLoading, 
    chainId,
    connectWallet, 
    disconnectWallet,
  } = useMetaMask();

  const formatAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: string | null): string => {
    if (!chainId) return 'Unknown Network';
    
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai Testnet',
    };
    return networks[chainId] || 'Unknown Network';
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px 0' 
    }}>
      {!isConnected ? (
        <button 
          onClick={connectWallet} 
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '5px' 
          }}>
            <span>Account: {formatAddress(account)}</span>
            <span>Network: {getNetworkName(chainId)}</span>
          </div>
          <button 
            onClick={disconnectWallet}
            style={{
              backgroundColor: '#cc0000',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;