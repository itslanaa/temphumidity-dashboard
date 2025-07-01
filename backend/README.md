# ESP8266 DHT11 Backend Server

This Node.js backend server receives real-time temperature and humidity data from ESP8266 microcontrollers with DHT11 sensors.

## Features

- RESTful API endpoints for sensor data
- Real-time WebSocket connections
- CORS support for frontend integration
- Data validation and error handling
- Connection status monitoring
- In-memory data storage with automatic cleanup

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST /api/sensor-data
Receives sensor data from ESP8266
- Body: `{ "temperature": 29.5, "humidity": 72, "status": "Normal" }`

### GET /api/sensor-data/latest
Returns the most recent sensor reading

### GET /api/sensor-data
Returns all sensor data with optional filtering
- Query params: `timeRange` (1h, 3h, 6h, all), `limit` (number)

### GET /api/status
Returns connection status and server statistics

### GET /api/health
Health check endpoint

## WebSocket

Real-time data updates are broadcast to connected clients via WebSocket on the same port.

## Configuration

- Default port: 3001
- CORS origins: localhost:5173, localhost:3000, 127.0.0.1:5173
- Data retention: Last 1000 readings
- Connection timeout: 60 seconds

## ESP8266 Configuration

Update the Arduino sketch with your server's IP address:
```cpp
const char* serverURL = "http://YOUR_SERVER_IP:3001/api/sensor-data";
```