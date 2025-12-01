import { ethers } from 'hardhat';

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

  // 4. Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DEL DEPLOYMENT');
  console.log('='.repeat(60));
  console.log('🏭 CoperachaFactory:', factoryAddress);
  console.log('👛 Coperacha de Prueba:', vaultAddress || 'N/A');
  console.log('👥 Miembros:', members.length);
  console.log('='.repeat(60));
  console.log('\n⚠️  IMPORTANTE: Copia la dirección del Factory a src/contracts/addresses.ts');
  console.log(`\nConst CONTRACTS = {`);
  console.log(`  ${(await ethers.provider.getNetwork()).chainId}: {`);
  console.log(`    CoperachaFactory: '${factoryAddress}',`);
  console.log(`  },`);
  console.log(`}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
