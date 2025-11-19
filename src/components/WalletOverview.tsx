import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface WalletOverviewProps {
  balance: number;
  onAddMoney: () => void;
  onSendMoney: () => void;
}

export function WalletOverview({ balance }: WalletOverviewProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="w-6 h-6" />
            Saldo Disponible
          </CardTitle>
          <Activity className="w-5 h-5 opacity-75" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-blue-100 text-sm mb-2">Balance Total</p>
            <p className="text-4xl">${balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Ingresos</p>
                <p className="text-sm">$1,500.00</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-blue-100">Gastos</p>
                <p className="text-sm">$250.75</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
