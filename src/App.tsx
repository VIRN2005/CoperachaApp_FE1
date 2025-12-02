import { Web3AuthProvider } from "./components/Web3AuthProvider";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";
import { useAccount } from "wagmi";

export default function App() {
  return (
    <Web3AuthProvider>
      <AppContent />
      <Toaster richColors position="top-right" />
    </Web3AuthProvider>
  );
}

function AppContent() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-white">
      {!isConnected ? (
        <LoginScreen onLogin={() => {}} />
      ) : (
        <Dashboard onLogout={() => {}} />
      )}
    </div>
  );
}
