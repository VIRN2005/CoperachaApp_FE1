import { Card, CardContent } from './ui/card';
import { ArrowDownToLine, ArrowUpFromLine, FileText } from 'lucide-react';
import { Transaction, Member } from './Dashboard';

interface TransactionListProps {
  transactions: Transaction[];
  members: Member[];
}

export function TransactionList({ transactions, members }: TransactionListProps) {
  const getMemberName = (address: string) => {
    const member = members.find(m => m.address === address);
    return member ? member.name : address;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-5 h-5" />;
      case 'withdrawal':
        return <ArrowUpFromLine className="w-5 h-5" />;
      case 'proposal':
        return <FileText className="w-5 h-5" />;
    }
  };

  const getColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-600';
      case 'withdrawal':
        return 'bg-red-100 text-red-600';
      case 'proposal':
        return 'bg-blue-100 text-blue-600';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay transacciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${getColor(transaction.type)}`}>
                {getIcon(transaction.type)}
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-gray-900">{transaction.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500">
                    De: {getMemberName(transaction.from)}
                  </p>
                  {transaction.to && (
                    <p className="text-sm text-gray-500">
                      Para: {getMemberName(transaction.to)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
