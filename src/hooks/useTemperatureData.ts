import { useState, useEffect, useCallback, useRef } from 'react';
import { TemperatureData, TimeRange } from '../types';

// Dynamically construct URLs based on current location
const getBackendUrls = () => {
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname;
  
  // In WebContainer, we need to use the correct port mapping
  const apiBaseUrl = `${protocol}//${hostname}:3001/api`;
  const wsUrl = `${wsProtocol}//${hostname}:3001`;
  
  return { apiBaseUrl, wsUrl };
};

export const useTemperatureData = () => {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [currentReading, setCurrentReading] = useState<TemperatureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data from API
  const fetchInitialData = useCallback(async () => {
    try {
      setError(null);
      const { apiBaseUrl } = getBackendUrls();
      const response = await fetch(`${apiBaseUrl}/sensor-data?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const formattedData = result.data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        
        setData(formattedData);
        
        if (formattedData.length > 0) {
          setCurrentReading(formattedData[formattedData.length - 1]);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to fetch sensor data. Please check if the backend server is running.');
      setIsLoading(false);
    }
  }, []);

  // Fetch latest reading
  const fetchLatestReading = useCallback(async () => {
    try {
      const { apiBaseUrl } = getBackendUrls();
      const response = await fetch(`${apiBaseUrl}/sensor-data/latest`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const formattedReading = {
            ...result.data,
            timestamp: new Date(result.data.timestamp)
          };
          
          setCurrentReading(formattedReading);
          setData(prev => [...prev, formattedReading]);
          setLastUpdate(new Date());
          setIsConnected(true);
          setError(null);
        }
      }
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      setIsConnected(false);
    }
  }, []);

  // Check connection status
  const checkConnectionStatus = useCallback(async () => {
    try {
      const { apiBaseUrl } = getBackendUrls();
      const response = await fetch(`${apiBaseUrl}/status`);
      if (response.ok) {
        const result = await response.json();
        setIsConnected(result.connected);
        if (result.lastUpdate) {
          setLastUpdate(new Date(result.lastUpdate));
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
    }
  }, []);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const { wsUrl } = getBackendUrls();
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'sensor-data' && message.data) {
            const formattedReading = {
              ...message.data,
              timestamp: new Date(message.data.timestamp)
            };
            
            setCurrentReading(formattedReading);
            setData(prev => {
              // Avoid duplicates by checking if the reading already exists
              const exists = prev.some(item => item.id === formattedReading.id);
              if (!exists) {
                return [...prev, formattedReading];
              }
              return prev;
            });
            setLastUpdate(new Date());
            setIsConnected(true);
            setError(null);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setError('WebSocket connection failed. Falling back to polling.');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setError('Failed to establish real-time connection. Using polling instead.');
    }
  }, []);

  // Initialize data and connections
  useEffect(() => {
    fetchInitialData();
    connectWebSocket();

    // Fallback polling every 30 seconds if WebSocket fails
    const pollingInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        fetchLatestReading();
      }
      checkConnectionStatus();
    }, 30000);

    return () => {
      clearInterval(pollingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [fetchInitialData, connectWebSocket, fetchLatestReading, checkConnectionStatus]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await fetchLatestReading();
    await checkConnectionStatus();
  }, [fetchLatestReading, checkConnectionStatus]);

  // Filter data by time range
  const filterDataByTimeRange = useCallback((timeRange: TimeRange): TemperatureData[] => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const hours = timeRange === '1h' ? 1 : timeRange === '3h' ? 3 : 6;
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    return data.filter(item => item.timestamp >= cutoff);
  }, [data]);

  return {
    data,
    currentReading,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    filterDataByTimeRange
  };
};