# 🚀 Guía de Deployment y Uso de Contratos Coperacha

## 📁 Estructura de Archivos Creados

```
CoperachaApp_FE1/
├── contracts/
│   ├── CoperachaFactory.sol       # Factory para crear wallets comunitarias
│   └── CoperachaWallet.sol        # Wallet comunitaria con votaciones
├── scripts/
│   └── deploy.ts                  # Script de deployment
├── src/
│   ├── contracts/
│   │   ├── CoperachaFactoryABI.ts # ABI del Factory
│   │   ├── CoperachaWalletABI.ts  # ABI de Wallet
│   │   └── addresses.ts           # Direcciones de contratos por red
│   └── hooks/
│       └── useCoperacha.ts        # Hooks personalizados de wagmi
├── hardhat.config.js              # Configuración de Hardhat
└── .env                           # Variables de entorno
```

## 🎯 Paso 1: Desplegar Contratos Localmente

### Opción A: Red Local Hardhat (Recomendado para desarrollo)

1. **Iniciar nodo local de Hardhat:**

   ```bash
   npx hardhat node
   ```

   Esto iniciará un nodo en `http://127.0.0.1:8545` con 20 cuentas de prueba.

2. **En otra terminal, desplegar contratos:**

   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

3. **Copiar la dirección del Factory:**
   El script mostrará algo como:

   ```
   🏭 CoperachaFactory: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

4. **Actualizar `src/contracts/addresses.ts`:**

   ```typescript
   31337: {
     CoperachaFactory: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // ✅ Tu dirección
   },
   ```

5. **Configurar MetaMask para red local:**
   - Red: Localhost 8545
   - Chain ID: 31337
   - RPC URL: http://127.0.0.1:8545
   - Importa una cuenta de prueba con la private key que te da Hardhat

### Opción B: Sepolia Testnet (Para producción de prueba)

1. **Obtener Sepolia ETH:**

   - Ve a https://sepoliafaucet.com
   - Consigue ETH de prueba gratis

2. **Configurar .env:**

   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/tu-api-key
   PRIVATE_KEY=tu_private_key_aqui
   ```

3. **Desplegar:**

   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

4. **Actualizar `src/contracts/addresses.ts`:**
   ```typescript
   11155111: {
     CoperachaFactory: '0xDireccionDelFactoryEnSepolia',
   },
   ```

## 🎮 Paso 2: Usar los Hooks en tu Frontend

### Ejemplo 1: Crear una Coperacha

```tsx
import { useCreateCoperacha } from "../hooks/useCoperacha";
import { useAccount } from "wagmi";

function CreateCoperachaButton() {
  const { address } = useAccount();
  const { createCoperacha, isPending, isSuccess } = useCreateCoperacha();

  const handleCreate = () => {
    if (!address) return;

    const members = [
      address,
      "0x123...", // Dirección del miembro 2
      "0x456...", // Dirección del miembro 3
    ];

    createCoperacha("Familia García", members);
  };

  return (
    <button onClick={handleCreate} disabled={isPending}>
      {isPending ? "Creando..." : isSuccess ? "✅ Creada!" : "Crear Coperacha"}
    </button>
  );
}
```

### Ejemplo 2: Ver tus Coperachas

```tsx
import { useUserCoperachas } from "../hooks/useCoperacha";
import { useAccount } from "wagmi";

function MyCoperachas() {
  const { address } = useAccount();
  const { data: coperachas, isLoading } = useUserCoperachas(address);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Mis Coperachas ({coperachas?.length || 0})</h2>
      {coperachas?.map((addr) => (
        <CoperachaCard key={addr} address={addr} />
      ))}
    </div>
  );
}
```

### Ejemplo 3: Depositar en una Coperacha

```tsx
import { useDepositToCoperacha } from "../hooks/useCoperacha";
import { useState } from "react";

function DepositButton({ vaultAddress }: { vaultAddress: Address }) {
  const [amount, setAmount] = useState("0.1");
  const { deposit, isPending, isSuccess } = useDepositToCoperacha(vaultAddress);

  const handleDeposit = () => {
    deposit(amount); // Cantidad en ETH
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
      />
      <button onClick={handleDeposit} disabled={isPending}>
        {isPending ? "Depositando..." : "Depositar"}
      </button>
      {isSuccess && <span>✅ Depósito exitoso!</span>}
    </div>
  );
}
```

### Ejemplo 4: Crear Propuesta de Retiro

```tsx
import { useProposeWithdrawal } from "../hooks/useCoperacha";
import { useState } from "react";

function CreateProposalButton({ vaultAddress }: { vaultAddress: Address }) {
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.1");

  const { proposeWithdrawal, isPending, isSuccess } =
    useProposeWithdrawal(vaultAddress);

  const handlePropose = () => {
    proposeWithdrawal(description, recipient as Address, amount);
  };

  return (
    <div>
      <input
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Destinatario (0x...)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cantidad ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePropose} disabled={isPending}>
        {isPending ? "Creando..." : "Crear Propuesta"}
      </button>
      {isSuccess && <span>✅ Propuesta creada!</span>}
    </div>
  );
}
```

### Ejemplo 5: Votar en una Propuesta

```tsx
import { useVoteOnProposal, useProposalInfo } from "../hooks/useCoperacha";

function VoteButtons({
  vaultAddress,
  proposalId,
}: {
  vaultAddress: Address;
  proposalId: number;
}) {
  const { vote, isPending } = useVoteOnProposal(vaultAddress);
  const { data: proposalInfo } = useProposalInfo(vaultAddress, proposalId);

  return (
    <div>
      <h3>{proposalInfo?.[3]}</h3> {/* description */}
      <p>Votos a favor: {proposalInfo?.[7].toString()}</p>
      <p>Votos en contra: {proposalInfo?.[8].toString()}</p>
      <button onClick={() => vote(proposalId, true)} disabled={isPending}>
        👍 Votar a Favor
      </button>
      <button onClick={() => vote(proposalId, false)} disabled={isPending}>
        👎 Votar en Contra
      </button>
    </div>
  );
}
```

### Ejemplo 6: Ver Balance de Coperacha

```tsx
import { useCoperachaBalance } from "../hooks/useCoperacha";
import { formatEther } from "viem";

function CoperachaBalance({ vaultAddress }: { vaultAddress: Address }) {
  const { data: balance } = useCoperachaBalance(vaultAddress);

  return (
    <div>
      <h3>Balance: {balance ? formatEther(balance) : "0"} ETH</h3>
    </div>
  );
}
```

## 📚 Hooks Disponibles

### Factory (CoperachaFactory)

- ✅ `useCreateCoperacha()` - Crear nueva Coperacha
- ✅ `useUserCoperachas(address)` - Obtener Coperachas del usuario
- ✅ `useAllCoperachas()` - Obtener todas las Coperachas
- ✅ `useCoperachaInfo(vaultAddress)` - Info de una Coperacha
- ✅ `useTotalCoperachas()` - Total de Coperachas creadas

### Wallet (CoperachaWallet)

- ✅ `useDepositToCoperacha(vaultAddress)` - Depositar fondos
- ✅ `useProposeWithdrawal(vaultAddress)` - Proponer retiro
- ✅ `useProposeAddMember(vaultAddress)` - Proponer nuevo miembro
- ✅ `useVoteOnProposal(vaultAddress)` - Votar en propuesta
- ✅ `useProposalInfo(vaultAddress, proposalId)` - Info de propuesta
- ✅ `useCoperachaMembers(vaultAddress)` - Obtener miembros
- ✅ `useCoperachaBalance(vaultAddress)` - Obtener balance
- ✅ `useHasVoted(vaultAddress, proposalId, voterAddress)` - Verificar voto
- ✅ `useIsMember(vaultAddress, memberAddress)` - Verificar membresía

## 🔥 Próximos Pasos

1. **Integrar en tus componentes existentes:**

   - Reemplaza los datos mock en `Dashboard.tsx`
   - Usa los hooks reales en `CommunityWallets.tsx`
   - Conecta `CreateWalletDialog.tsx` con `useCreateCoperacha()`

2. **Probar el flujo completo:**

   - Crear Coperacha ✅
   - Depositar fondos ✅
   - Crear propuesta ✅
   - Votar ✅
   - Ver ejecución automática ✅

3. **Mejorar UX:**
   - Mostrar loading states
   - Notificaciones con toast (usa `sonner` que ya tienes)
   - Manejo de errores

¿Quieres que integre estos hooks en tus componentes existentes? 🚀
