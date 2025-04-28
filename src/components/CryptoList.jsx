import { useEffect, useState } from 'react';
import api from '../services/api';
import CryptoChart from './CryptoChart';
import PriceAlert from './PriceAlert';

export default function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptos = async () => {
    try {
      const { data } = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
        },
      });
      setCryptos(data);
    } catch (error) {
      console.error('Erro ao buscar criptomoedas:', error);
    }
  };

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">📈 Crypto Dashboard</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar criptomoeda..."
          className="border p-2 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="space-y-2">
        {filteredCryptos.map(crypto => (
          <li key={crypto.id} className="border p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSelectedCrypto(crypto.id)}>
            {crypto.name} - ${crypto.current_price.toLocaleString()}
          </li>
        ))}
      </ul>

      {selectedCrypto && (
        <div className="mt-8">
          <CryptoChart cryptoId={selectedCrypto} />
          <PriceAlert cryptoId={selectedCrypto} />
        </div>
      )}
    </div>
  );
}
