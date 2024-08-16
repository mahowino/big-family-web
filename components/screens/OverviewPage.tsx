import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import { Transaction } from '../Transactions';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface OverviewProps {
  transactions: Transaction[];
}

export const Overview: React.FC<OverviewProps> = ({ transactions }) => {
  // Process transactions to chart data
  const processedData = transactions.map((t, index) => ({
    x: index, // Use index as the x-axis value
    y: parseFloat(t.amount.replace(/[$,]/g, ''))
  }));

  // Ensure at least one data point
  if (processedData.length === 0) {
    processedData.push({ x: 0, y: 0 });
  }

  // Calculate totals
  const totalVerified = transactions
    .filter(t => t.validated)
    .reduce((acc, cur) => acc + parseFloat(cur.amount.replace(/[$,]/g, '')), 0);

  const totalUnverified = transactions
    .filter(t => t.status === "Completed" && !t.validated)
    .reduce((acc, cur) => acc + parseFloat(cur.amount.replace(/[$,]/g, '')), 0);

  const totalEarned = transactions
    .reduce((acc, cur) => acc + parseFloat(cur.amount.replace(/[$,]/g, '')), 0);

  // Prepare chart data
  const chartData: ChartData<'line'> = {
    datasets: [
      {
        label: 'Transaction Amount',
        data: processedData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      },
    ]
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: KES ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear', // Use linear scale for indices
        position: 'bottom',
        title: {
          display: true,
          text: 'Transaction Index'
        },
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (KES)'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Overview Stats */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 bg-gradient-to-r from-blue-50 via-green-50 to-yellow-50">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Current User Balance</h3>
            <p className="text-2xl font-bold text-blue-600">KES {totalVerified.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Unverified Transactions</h3>
            <p className="text-2xl font-bold text-yellow-600">KES {totalUnverified.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Earned</h3>
            <p className="text-2xl font-bold text-green-600">KES {totalEarned.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Transaction Amounts</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
