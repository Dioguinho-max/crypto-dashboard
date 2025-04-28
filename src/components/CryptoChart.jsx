import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function CryptoChart({ cryptoId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChart();
  }, [cryptoId]);

  const fetchChart = async () => {
    try {
      const { data } = await api.get(`/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: 1,
          interval: 'hourly',
        },
      });

      const prices = data.prices.map(p => p[1]);
      const times = data.prices.map(p => new Date(p[0]).toLocaleTimeString());

      setChartData({
        labels: times,
        datasets: [{
          label: 'Preço USD',
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.4,
          fill: false,
        }],
      });
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
    }
  };

  if (!chartData) return <p>Carregando gráfico...</p>;

  return (
    <div className="mt-8">
      <Line data={chartData} />
    </div>
  );
}
