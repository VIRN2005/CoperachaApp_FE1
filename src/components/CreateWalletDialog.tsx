import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, X, Sparkles } from 'lucide-react';

interface CreateWalletDialogProps {
  onCreateWallet: (name: string, description: string, members: string[]) => void;
}

export function CreateWalletDialog({ onCreateWallet }: CreateWalletDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const handleAddMember = () => {
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (address: string) => {
    setMembers(members.filter(m => m !== address));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && members.length >= 2) {
      onCreateWallet(name, description, members);
      setName('');
      setDescription('');
      setMembers([]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all rounded-xl px-6 py-6">
          <Plus className="w-5 h-5" />
          <span>Nueva Billetera</span>
          <Sparkles className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Crear Billetera Comunitaria
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Nombre de la billetera</Label>
              <Input
                id="name"
                placeholder="Ej: Familia García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-200 focus:border-blue-500 rounded-xl py-6 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Descripción</Label>
              <Textarea
                id="description"
                placeholder="¿Para qué usarán esta billetera?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Miembros (mínimo 2)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Dirección Ethereum (0x...)"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                  className="border-gray-200 focus:border-blue-500 rounded-xl"
                />
                <Button 
                  type="button" 
                  onClick={handleAddMember} 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl px-6"
                >
                  Agregar
                </Button>
              </div>
              
              {members.length > 0 && (
                <div className="space-y-2 mt-4">
                  {members.map((member) => (
                    <div key={member} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200/50">
                      <span className="text-sm text-gray-700 font-mono">{member}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        className="hover:bg-white/60 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {members.length} miembro{members.length !== 1 ? 's' : ''} • Se requieren <strong>{Math.ceil(members.length / 2)} votos</strong> para aprobar gastos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="rounded-xl border-2 border-gray-200 hover:bg-gray-50 px-6"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-500/30 rounded-xl px-6" 
              disabled={!name || members.length < 2}
            >
              Crear Billetera
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}