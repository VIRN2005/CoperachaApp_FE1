import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Desplegando contratos de Coperacha...\n');

  // 1. Desplegar CoperachaWallet (solo para compilar, el Factory lo despliega)
  const CoperachaWallet = await ethers.getContractFactory('CoperachaWallet');
  console.log('✅ CoperachaWallet compilado correctamente');

  // 2. Desplegar CoperachaFactory
  const CoperachaFactory = await ethers.getContractFactory('CoperachaFactory');
  console.log('📦 Desplegando CoperachaFactory...');
  
  const factory = await CoperachaFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log('✅ CoperachaFactory desplegado en:', factoryAddress);

  // 3. Crear una Coperacha de prueba
  console.log('\n🧪 Creando Coperacha de prueba...');
  
  const [deployer, member1, member2] = await ethers.getSigners();
  const members = [deployer.address, member1.address, member2.address];
  
  const tx = await factory.createVault('Familia Test', members);
  const receipt = await tx.wait();
  
  // Obtener la dirección de la nueva Coperacha del evento
  const event = receipt?.logs.find((log: any) => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed?.name === 'VaultCreated';
    } catch {
      return false;
    }
  });
  
  let vaultAddress;
  if (event) {
    const parsed = factory.interface.parseLog(event);
    vaultAddress = parsed?.args[0];
    console.log('✅ Coperacha de prueba creada en:', vaultAddress);
  }

  // 4. Actualizar addresses.ts automáticamente
  console.log('\n📝 Actualizando addresses.ts...');
  const chainId = (await ethers.provider.getNetwork()).chainId;
  await updateAddressesFile(factoryAddress, Number(chainId));
  console.log('✅ Archivo addresses.ts actualizado');

  // 5. Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DEL DEPLOYMENT');
  console.log('='.repeat(60));
  console.log('🏭 CoperachaFactory:', factoryAddress);
  console.log('👛 Coperacha de Prueba:', vaultAddress || 'N/A');
  console.log('👥 Miembros:', members.length);
  console.log('🌐 Red (Chain ID):', chainId);
  console.log('='.repeat(60));
  console.log('\n✅ El contrato se ha actualizado automáticamente en addresses.ts');
}

async function updateAddressesFile(factoryAddress: string, chainId: number) {
  const addressesPath = path.join(__dirname, '..', 'src', 'contracts', 'addresses.ts');
  
  // Leer el archivo actual
  let content = fs.readFileSync(addressesPath, 'utf8');
  
  // Buscar la sección del chainId correspondiente
  const chainIdPattern = new RegExp(
    `(${chainId}:\\s*{[^}]*CoperachaFactory:\\s*')([^']*)(')`,
    'g'
  );
  
  if (content.match(chainIdPattern)) {
    // Si existe el chainId, actualizar la dirección
    content = content.replace(chainIdPattern, `$1${factoryAddress}$3`);
  } else {
    // Si no existe el chainId, agregarlo antes del cierre del objeto CONTRACTS
    const insertPattern = /(\} as const;)/;
    const newChainConfig = `  // Chain ID ${chainId}\n  ${chainId}: {\n    CoperachaFactory: '${factoryAddress}' as Address,\n  },\n`;
    content = content.replace(insertPattern, `${newChainConfig}$1`);
  }
  
  // Escribir el archivo actualizado
  fs.writeFileSync(addressesPath, content, 'utf8');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
