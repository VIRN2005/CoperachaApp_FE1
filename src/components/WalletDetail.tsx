import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Users, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { CommunityWallet } from './Dashboard';
import { ProposalCard } from './ProposalCard';
import { CreateProposalDialog } from './CreateProposalDialog';
import { DepositDialog } from './DepositDialog';
import { TransactionList } from './TransactionList';

interface WalletDetailProps {
  wallet: CommunityWallet;
  userAddress: string;
  onBack: () => void;
  onVote: (walletId: string, proposalId: string, vote: 'for' | 'against') => void;
  onCreateProposal: (walletId: string, title: string, description: string, amount: string, recipient: string) => void;
  onDeposit: (walletId: string, amount: string) => void;
}

export function WalletDetail({ wallet, userAddress, onBack, onVote, onCreateProposal, onDeposit }: WalletDetailProps) {
  const [activeTab, setActiveTab] = useState('proposals');

  const activeProposals = wallet.proposals.filter(p => p.status === 'active');
  const completedProposals = wallet.proposals.filter(p => p.status !== 'active');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2 hover:bg-white/60 rounded-xl px-4 py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      {/* Wallet Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">{wallet.name}</h1>
            <p className="text-xl font-semibold text-gray-600">{wallet.description}</p>
          </div>
          <div className="flex gap-3">
            <DepositDialog onDeposit={(amount) => onDeposit(wallet.id, amount)} />
            <CreateProposalDialog
              members={wallet.members}
              onCreateProposal={(title, description, amount, recipient) =>
                onCreateProposal(wallet.id, title, description, amount, recipient)
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Balance Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">${wallet.balance}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Disponible para gastar</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Miembros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  {wallet.members.slice(0, 5).map((member, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 bg-gradient-to-br ${member.avatar} rounded-full border-3 border-white shadow-lg -ml-2 first:ml-0 hover:scale-110 transition-transform`}
                      title={member.name}
                    />
                  ))}
                  {wallet.members.length > 5 && (
                    <span className="text-sm text-gray-600 ml-1">+{wallet.members.length - 5}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{wallet.members.length} participantes activos</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Propuestas Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{activeProposals.length}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Requieren tu voto</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white/60 backdrop-blur-sm border border-white/50 p-1 rounded-2xl shadow-lg">
          <TabsTrigger 
            value="proposals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Propuestas {activeProposals.length > 0 && `(${activeProposals.length})`}
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Activity className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger 
            value="members"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            Miembros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          {activeProposals.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-500" />
                Propuestas Activas
              </h3>
              {activeProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userAddress={userAddress}
                  onVote={(vote) => onVote(wallet.id, proposal.id, vote)}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-gray-700 mb-2">No hay propuestas activas</p>
              <p className="font-semibold text-gray-500">Crea una propuesta para comenzar</p>
            </div>
          )}

          {completedProposals.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mt-12">Propuestas Completadas</h3>
              {completedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userAddress={userAddress}
                  onVote={(vote) => onVote(wallet.id, proposal.id, vote)}
                />
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="history">
          <TransactionList transactions={wallet.transactions} members={wallet.members} />
        </TabsContent>

        <TabsContent value="members">
          <div className="grid gap-4">
            {wallet.members.map((member) => (
              <div key={member.address} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${member.avatar} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                <Card className="relative border-0 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${member.avatar} rounded-2xl shadow-lg`} />
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{member.name}</p>
                        <p className="text-sm font-semibold text-gray-500 font-mono">{member.address}</p>
                      </div>
                      {member.address === userAddress && (
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl text-sm shadow-lg">
                          Tú
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}