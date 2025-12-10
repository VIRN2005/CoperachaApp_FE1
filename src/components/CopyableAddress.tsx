import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyableAddressProps {
  address: string;
  showFull?: boolean;
  className?: string;
}

export function CopyableAddress({
  address,
  showFull = false,
  className = "",
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Dirección copiada", {
        description: `${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Error al copiar", {
        description: "No se pudo copiar la dirección",
      });
    }
  };

  const displayAddress = showFull
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 font-mono text-sm transition-all hover:text-blue-600 active:scale-95 group cursor-pointer relative z-10 ${className}`}
      title="Click para copiar"
      type="button"
    >
      <span className="group-hover:font-semibold transition-all">
        {displayAddress}
      </span>
      {copied ? (
        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
      ) : (
        <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      )}
    </button>
  );
}
