import { useState, useEffect } from 'react';

export function useEthPrice() {
  const [ethPriceUSD, setEthPriceUSD] = useState<number>(3500); // Precio por defecto

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        if (data.ethereum?.usd) {
          setEthPriceUSD(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Mantener el precio por defecto si falla
      }
    };

    fetchPrice();
    // Actualizar precio cada 5 minutos
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return ethPriceUSD;
}

export function formatEthToUSD(ethAmount: string | number, ethPrice: number): string {
  const eth = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  const usd = eth * ethPrice;
  return usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
