import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CreditCard, Building2, Bitcoin } from 'lucide-react';
import { PaymentMethod } from '../App';

interface PaymentMethodsProps {
  methods: PaymentMethod[];
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  const getIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'bank':
        return <Building2 className="w-5 h-5" />;
      case 'crypto':
        return <Bitcoin className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {methods.map((method) => (
            <div 
              key={method.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {getIcon(method.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{method.name}</p>
                  {method.last4 && (
                    <p className="text-xs text-gray-500">•••• {method.last4}</p>
                  )}
                </div>
              </div>
              {method.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Predeterminado
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
