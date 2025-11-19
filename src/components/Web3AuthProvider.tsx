import { createContext, useContext, useState, ReactNode } from 'react';

interface Web3AuthContextType {
  userAddress: string | null;
  balance: string;
  login: () => Promise<void>;
  logout: () => void;
  isConnected: boolean;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);

  const login = async () => {
    // Simulación de Web3Auth login
    // En producción, aquí iría la integración real con Web3Auth
    try {
      // Mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setUserAddress(mockAddress);
      setBalance('2.5');
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const logout = () => {
    setUserAddress(null);
    setBalance('0');
    setIsConnected(false);
  };

  return (
    <Web3AuthContext.Provider value={{ userAddress, balance, login, logout, isConnected }}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within Web3AuthProvider');
  }
  return context;
}
