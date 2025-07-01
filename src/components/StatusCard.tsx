import React from 'react';
import { Thermometer, Droplets, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { TemperatureData } from '../types';

interface StatusCardProps {
  currentReading: TemperatureData | null;
  lastUpdate: Date;
  isConnected: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  currentReading, 
  lastUpdate, 
  isConnected 
}) => {
  if (!currentReading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const statusColor = currentReading.status === 'Normal' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
    
  const statusBg = currentReading.status === 'Normal'
    ? 'bg-green-100 dark:bg-green-900/30'
    : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Temperature Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Thermometer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Temperature</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor} flex items-center space-x-1`}>
            {currentReading.status === 'Normal' ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            <span>{currentReading.status}</span>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {currentReading.temperature}
          </span>
          <span className="text-xl text-gray-600 dark:text-gray-400">°C</span>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
            <Droplets className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Humidity</h3>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {currentReading.humidity}
          </span>
          <span className="text-xl text-gray-600 dark:text-gray-400">%</span>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Update</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lastUpdate.toLocaleTimeString()}
          </p>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};