'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  dates: string[];
  activeUsers: number[];
  pageViews: number[];
  sessions: number[];
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const formattedData: AnalyticsData = {
        dates: [],
        activeUsers: [],
        pageViews: [],
        sessions: [],
      };

      data.data.rows?.forEach((row: any) => {
        formattedData.dates.push(formatDate(row.dimensionValues[0].value));
        formattedData.activeUsers.push(parseInt(row.metricValues[0].value));
        formattedData.pageViews.push(parseInt(row.metricValues[1].value));
        formattedData.sessions.push(parseInt(row.metricValues[2].value));
      });

      setAnalyticsData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <div>Loading analytics data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analyticsData) return null;

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Website Analytics - Last 30 Days',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData: ChartData<'line'> = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: 'Active Users',
        data: analyticsData.activeUsers,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Page Views',
        data: analyticsData.pageViews,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Sessions',
        data: analyticsData.sessions,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}