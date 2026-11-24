
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function ChartPanel({ type, title, labels = [], data = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: '#8795ff',
        backgroundColor:
          type === 'line'
            ? 'rgba(135, 149, 255, 0.15)'
            : ['#7c8cff', '#f47d9b', '#f5c66b'],
        borderWidth: 2,
        tension: 0.35,
        fill: type === 'line',
        pointBackgroundColor: '#a5b0ff',
        pointRadius: 4,
        borderRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#aab7ce',
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#8998b4' },
        grid: { color: 'rgba(137, 152, 180, 0.08)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#8998b4' },
        grid: { color: 'rgba(137, 152, 180, 0.08)' },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="chart-wrap">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}