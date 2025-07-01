export interface TemperatureData {
  id: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  status: 'Normal' | 'Abnormal';
  device_id?: string;
}

export interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export type TimeRange = '1h' | '3h' | '6h' | 'all';
export type Theme = 'light' | 'dark';

export interface SensorReading {
  temperature: number;
  humidity: number;
  status: string;
  timestamp: number;
  device_id: string;
}