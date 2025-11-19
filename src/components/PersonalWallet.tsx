import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Sparkles, TrendingUp } from 'lucide-react';
import { useWeb3Auth } from './Web3AuthProvider';

export function PersonalWallet() {
  const { balance } = useWeb3Auth();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl blur-xl opacity-20"></div>
      <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold">Billetera Personal</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Sparkles className="w-3 h-3" />
                <span>Tu balance privado</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-xl">
            <p className="text-sm font-semibold text-blue-100 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Balance Disponible
            </p>
            <p className="text-4xl font-bold text-white mb-2">{balance} ETH</p>
            <p className="text-sm font-semibold text-blue-100">
              ≈ ${(parseFloat(balance) * 2400).toFixed(2)} USD
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-xl py-6">
              <ArrowDownToLine className="w-5 h-5" />
              <span>Recibir</span>
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl transition-all hover:scale-105 rounded-xl py-6">
              <ArrowUpFromLine className="w-5 h-5" />
              <span>Enviar</span>
            </Button>
          </div>

          <div className="pt-4 border-t border-blue-200/50">
            <p className="text-sm text-gray-500 mb-3">Información</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                <span className="text-gray-600">Red</span>
                <span className="text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Ethereum
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                <span className="text-gray-600">Billeteras comunitarias</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg text-xs shadow-lg">
                  2 activas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}