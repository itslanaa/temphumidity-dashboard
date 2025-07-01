import React from 'react';
import { Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: Date;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  lastUpdate 
}) => {
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} hours ago`;
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-4 border transition-all duration-300 ${
      isConnected 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isConnected 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${
              isConnected 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              ESP8266 Sensor {isConnected ? 'Connected' : 'Disconnected'}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last update: {getTimeSinceUpdate()}
              </span>
            </div>
          </div>
        </div>
        
        {!isConnected && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Check sensor connection</span>
          </div>
        )}
        
        {isConnected && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Live
            </span>
          </div>
        )}
      </div>
    </div>
  );
};