import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Clock, Zap, Sparkles } from 'lucide-react';
import { Proposal } from './Dashboard';

interface ProposalCardProps {
  proposal: Proposal;
  userAddress: string;
  onVote: (vote: 'for' | 'against') => void;
}

export function ProposalCard({ proposal, userAddress, onVote }: ProposalCardProps) {
  const hasVoted = proposal.votesFor.includes(userAddress) || proposal.votesAgainst.includes(userAddress);
  const votedFor = proposal.votesFor.includes(userAddress);
  const progress = (proposal.votesFor.length / proposal.requiredVotes) * 100;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative group">
      {proposal.status === 'approved' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-30"></div>
      )}
      {proposal.status === 'active' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      )}
      
      <Card className={`relative border-0 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all rounded-3xl overflow-hidden ${
        proposal.status === 'approved' 
          ? 'bg-gradient-to-br from-green-50/80 to-emerald-50/80' 
          : 'bg-white/80'
      }`}>
        {proposal.status === 'approved' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        )}
        {proposal.status === 'active' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse"></div>
        )}
        
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-900">{proposal.title}</h3>
                {proposal.status === 'approved' && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Aprobada
                  </Badge>
                )}
                {proposal.status === 'rejected' && (
                  <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0 shadow-lg px-3 py-1">
                    <XCircle className="w-4 h-4 mr-1" />
                    Rechazada
                  </Badge>
                )}
                {proposal.status === 'active' && (
                  <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 shadow-lg px-3 py-1 animate-pulse">
                    <Clock className="w-4 h-4 mr-1" />
                    Activa
                  </Badge>
                )}
              </div>
              <p className="font-semibold text-gray-600 mb-4 text-lg">{proposal.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                  <span className="text-sm text-gray-500">Monto: </span>
                  <span className="text-lg bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">${proposal.amount}</span>
                </div>
                <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                  <span className="text-sm text-gray-500">Para: </span>
                  <span className="text-sm text-gray-900 font-mono">{proposal.recipient.slice(0, 10)}...</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(proposal.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Voting Progress */}
          <div className="mb-6 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Progreso de votación
              </span>
              <span className="text-lg text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                {proposal.votesFor.length} / {proposal.requiredVotes} votos
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={`h-3 rounded-full transition-all shadow-lg ${
                  proposal.status === 'approved' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            
            {/* Vote indicators */}
            <div className="flex gap-2 mt-3">
              {Array.from({ length: proposal.requiredVotes }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i < proposal.votesFor.length
                      ? proposal.status === 'approved'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Voting Buttons */}
          {proposal.status === 'active' && (
            <div className="flex gap-4">
              {!hasVoted ? (
                <>
                  <Button
                    onClick={() => onVote('for')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-2 py-6 rounded-xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Votar a favor</span>
                  </Button>
                  <Button
                    onClick={() => onVote('against')}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 gap-2 py-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>Votar en contra</span>
                  </Button>
                </>
              ) : (
                <div className="flex-1 p-5 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border-2 border-white/50 shadow-lg">
                  <p className="text-center">
                    {votedFor ? (
                      <span className="flex items-center justify-center gap-2 text-green-700 text-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <ThumbsUp className="w-5 h-5 text-white" />
                        </div>
                        Has votado a favor
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 text-red-700 text-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <ThumbsDown className="w-5 h-5 text-white" />
                        </div>
                        Has votado en contra
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}