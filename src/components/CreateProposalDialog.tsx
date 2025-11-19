import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FilePlus } from 'lucide-react';
import { Member } from './Dashboard';

interface CreateProposalDialogProps {
  members: Member[];
  onCreateProposal: (title: string, description: string, amount: string, recipient: string) => void;
}

export function CreateProposalDialog({ members, onCreateProposal }: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && amount && recipient) {
      onCreateProposal(title, description, amount, recipient);
      setTitle('');
      setDescription('');
      setAmount('');
      setRecipient('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-6 py-6">
          <FilePlus className="w-5 h-5" />
          <span>Nueva Propuesta</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Crear Propuesta de Gasto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Medicamentos para los abuelos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el motivo del gasto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 border-gray-200 focus:border-blue-500 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Destinatario</Label>
              <Select value={recipient} onValueChange={setRecipient} required>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 rounded-xl">
                  <SelectValue placeholder="Selecciona un miembro" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.address} value={member.address}>
                      {member.name} ({member.address.slice(0, 10)}...)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Importante:</strong> Esta propuesta requerirá {Math.ceil(members.length / 2)} votos a favor
                para ser aprobada automáticamente.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/30 rounded-xl">
              Crear Propuesta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}