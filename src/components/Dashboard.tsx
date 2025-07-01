import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { StatusCard } from './StatusCard';
import { Chart } from './Chart';
import { Controls } from './Controls';
import { ConnectionStatus } from './ConnectionStatus';
import { useTemperatureData } from '../hooks/useTemperatureData';
import { exportToCSV } from '../utils/dataExport';
import { TimeRange, Theme } from '../types';

export const Dashboard: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [timeRange, setTimeRange] = useState<TimeRange>('3h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    data,
    currentReading,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    filterDataByTimeRange
  } = useTemperatureData();

  const filteredData = filterDataByTimeRange(timeRange);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    exportToCSV(filteredData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Connecting to ESP8266 sensor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Connection Status Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Connection Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <ConnectionStatus isConnected={isConnected} lastUpdate={lastUpdate} />
        
        <StatusCard 
          currentReading={currentReading}
          lastUpdate={lastUpdate}
          isConnected={isConnected}
        />
        
        <Controls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isRefreshing={isRefreshing}
        />
        
        <Chart data={filteredData} />
        
        {/* Data Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredData.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Readings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredData.filter(d => d.status === 'Normal').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Normal Readings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {filteredData.filter(d => d.status === 'Abnormal').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abnormal Readings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {filteredData.length > 0 ? Math.round(filteredData.reduce((sum, d) => sum + d.humidity, 0) / filteredData.length) : 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Humidity</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ESP8266 + DHT11 Temperature & Humidity Monitoring System
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Real-time sensor data • Backend: Node.js • Frontend: React + TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
};