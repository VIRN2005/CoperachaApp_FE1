import { Button } from "./ui/button";
import {
  Wallet,
  Users,
  Shield,
  Zap,
  Sparkles,
  Heart,
  CheckCircle,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { isConnected } = useAccount();

  // Auto-login cuando se conecta la wallet
  useEffect(() => {
    if (isConnected) {
      onLogin();
    }
  }, [isConnected, onLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/20 backdrop-blur-sm bg-white/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <span className="text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                cooperacha
              </span>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span>Ahorro familiar Web3</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-900">
                Plataforma descentralizada y segura
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
                Tu familia, tu ahorro,
                <br />
                tu control
              </h1>
              <p className="text-2xl font-semibold text-gray-700 leading-relaxed">
                Crea billeteras comunitarias, aporta junto a tu familia y toma
                decisiones democráticas con votación en blockchain.
              </p>
            </div>

            <div className="grid gap-4">
              <FeatureItem
                icon={<Users className="w-6 h-6" />}
                title="Billeteras Comunitarias Ilimitadas"
                description="Participa en múltiples grupos con tu familia y amigos"
                gradient="from-blue-500 to-cyan-500"
              />
              <FeatureItem
                icon={<Shield className="w-6 h-6" />}
                title="Votación Democrática Automática"
                description="Mitad + 1 de votos ejecuta el retiro al instante"
                gradient="from-cyan-500 to-teal-500"
              />
              <FeatureItem
                icon={<Zap className="w-6 h-6" />}
                title="Smart Contracts en Ethereum"
                description="Transparente, seguro e inmutable en la blockchain"
                gradient="from-teal-500 to-emerald-500"
              />
            </div>

            <div className="pt-8 space-y-4">
              {/* Botón personalizado de RainbowKit */}
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              className="group relative bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:via-cyan-700 hover:to-emerald-700 text-white px-10 py-7 rounded-2xl text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all hover:scale-105"
                            >
                              <div className="flex items-center gap-3">
                                <Wallet className="w-6 h-6" />
                                <span>Conectar Wallet</span>
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                              </div>
                            </Button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sin contraseñas • Completamente descentralizado • Gastos
                compartidos
              </p>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="hidden lg:block relative">
            {/* Floating Card 1 - Wallet */}
            <div className="absolute top-0 right-0 animate-float">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/20 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Familia García
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      $1,250.00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full ring-4 ring-white"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full ring-4 ring-white -ml-3"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full ring-4 ring-white -ml-3"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full ring-4 ring-white -ml-3"></div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-700 ring-4 ring-white -ml-3">
                    +1
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Proposal */}
            <div className="absolute bottom-20 left-0 animate-float-delayed">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-2xl shadow-emerald-500/20 w-96">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-600">
                      Propuesta Aprobada
                    </p>
                    <p className="font-semibold text-gray-900">
                      Medicamentos abuelos
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Votación</span>
                    <span className="text-gray-900">5/5 votos ✓</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full w-full shadow-lg"></div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 3 - Stats */}
            <div className="absolute top-40 left-10 animate-float-slow">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-xl shadow-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Ahorrado este mes
                    </p>
                    <p className="text-xl font-bold text-gray-900">$850.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group flex gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 transition-all hover:scale-105 hover:shadow-xl cursor-pointer">
      <div
        className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
