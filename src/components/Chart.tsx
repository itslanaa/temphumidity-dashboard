import React, { useMemo } from 'react';
import { TemperatureData } from '../types';

interface ChartProps {
  data: TemperatureData[];
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, height = 400 }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return { temperaturePath: '', humidityPath: '', points: [] };

    const padding = 40;
    const chartWidth = 800;
    const chartHeight = height - padding * 2;

    // Get data ranges
    const temperatures = data.map(d => d.temperature);
    const humidities = data.map(d => d.humidity);
    const minTemp = Math.min(...temperatures) - 2;
    const maxTemp = Math.max(...temperatures) + 2;
    const minHumidity = Math.min(...humidities) - 5;
    const maxHumidity = Math.max(...humidities) + 5;

    // Create scale functions
    const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
    const tempScale = (temp: number) => chartHeight - ((temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
    const humidityScale = (humidity: number) => chartHeight - ((humidity - minHumidity) / (maxHumidity - minHumidity)) * chartHeight;

    // Generate paths
    const temperaturePath = data.map((d, i) => {
      const x = xScale(i);
      const y = tempScale(d.temperature);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const humidityPath = data.map((d, i) => {
      const x = xScale(i);
      const y = humidityScale(d.humidity);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    // Generate points for hover
    const points = data.map((d, i) => ({
      x: xScale(i),
      tempY: tempScale(d.temperature),
      humidityY: humidityScale(d.humidity),
      data: d
    }));

    return { temperaturePath, humidityPath, points, minTemp, maxTemp, minHumidity, maxHumidity };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temperature & Humidity Trends</h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          Loading chart data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Temperature & Humidity Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 800 ${height}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="humidityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g className="opacity-20">
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={(height - 80) / 4 * i + 40}
                x2="800"
                y2={(height - 80) / 4 * i + 40}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-400"
              />
            ))}
          </g>

          {/* Temperature line */}
          <path
            d={chartData.temperaturePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Humidity line */}
          <path
            d={chartData.humidityPath}
            fill="none"
            stroke="#14B8A6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {chartData.points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.tempY}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={point.x}
                cy={point.humidityY}
                r="4"
                fill="#14B8A6"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
            </g>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-10 -ml-8">
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(chartData.maxTemp)}°C</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round((chartData.maxTemp + chartData.minTemp) / 2)}°C</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(chartData.minTemp)}°C</span>
        </div>
      </div>
    </div>
  );
};