import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PriceAlert({ cryptoId }) {
  const [targetPrice, setTargetPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [cryptoId]);

  const fetchPrice = async () => {
    try {
      const { data } = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: cryptoId,
        },
      });
      const price = data[0]?.current_price;
      setCurrentPrice(price);

      if (alertActive && targetPrice && price >= parseFloat(targetPrice)) {
        toast.success(`🚀 ${cryptoId.toUpperCase()} atingiu $${price}!`);
        setAlertActive(false);
      }
    } catch (error) {
      console.error('Erro ao buscar preço atual:', error);
    }
  };

  const handleSetAlert = () => {
    setAlertActive(true);
    toast.info(`🔔 Alerta configurado para $${targetPrice}`);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Definir alerta de preço</h2>
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="number"
          placeholder="Preço alvo (USD)"
          className="border rounded p-2"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
        <button
          onClick={handleSetAlert}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Definir Alerta
        </button>
      </div>
      {currentPrice && (
        <p className="text-gray-600 dark:text-gray-300 mt-2">Preço atual: ${currentPrice}</p>
      )}
    </div>
  );
}
