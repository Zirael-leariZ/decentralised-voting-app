// src/providers/Providers.tsx
import type { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseGoerli } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProofProvider } from '@vlayer/react';

const config = createConfig({
  chains: [baseGoerli],
  transports: {
    [baseGoerli.id]: http(),
  },
});

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ProofProvider>
          {children}
        </ProofProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}