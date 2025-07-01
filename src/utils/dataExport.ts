import { TemperatureData } from '../types';

export const exportToCSV = (data: TemperatureData[]): void => {
  if (data.length === 0) {
    alert('No data available to export');
    return;
  }

  const csvContent = [
    ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Status', 'Device ID'],
    ...data.map(row => [
      row.timestamp.toLocaleString(),
      row.temperature.toString(),
      row.humidity.toString(),
      row.status,
      row.device_id || 'ESP8266_DHT11'
    ])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `esp8266-dht11-data-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data: TemperatureData[]): void => {
  if (data.length === 0) {
    alert('No data available to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `esp8266-dht11-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  window.URL.revokeObjectURL(url);
};