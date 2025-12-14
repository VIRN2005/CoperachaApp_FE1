import { useState, useEffect } from 'react';

interface EthPriceData {
  price: number;
  isLoading: boolean;
  error: string | null;
}

export function useEthPrice(): number {
  const [ethPriceUSD, setEthPriceUSD] = useState<number>(3500); // Precio por defecto

  useEffect(() => {
    let retries = 0;
    const maxRetries = 3;

    const fetchPrice = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.ethereum?.usd) {
          setEthPriceUSD(data.ethereum.usd);
          retries = 0; // Reset retries en caso de éxito
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: any) {
        console.error('Error fetching ETH price:', error?.message || error);

        // Reintentar si no hemos alcanzado el máximo
        if (retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
          setTimeout(fetchPrice, delay);
        }
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
  if (!eth || isNaN(eth) || !ethPrice || isNaN(ethPrice)) {
    return '0.00';
  }
  const usd = eth * ethPrice;
  return usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
