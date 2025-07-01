const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for sensor data
let sensorData = [];
let latestReading = null;
let lastUpdateTime = null;

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send latest data to newly connected client
  if (latestReading) {
    ws.send(JSON.stringify({
      type: 'sensor-data',
      data: latestReading
    }));
  }
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Broadcast data to all connected WebSocket clients
function broadcastToClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'sensor-data',
        data: data
      }));
    }
  });
}

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    lastUpdate: lastUpdateTime
  });
});

// Receive sensor data from ESP8266
app.post('/api/sensor-data', (req, res) => {
  try {
    const { temperature, humidity, status, timestamp, device_id } = req.body;
    
    // Validate required fields
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: temperature and humidity'
      });
    }
    
    // Create sensor reading object
    const sensorReading = {
      id: Date.now().toString(),
      temperature: parseFloat(temperature),
      humidity: parseInt(humidity),
      status: status || (temperature > 30 ? 'Abnormal' : 'Normal'),
      timestamp: new Date(),
      device_id: device_id || 'ESP8266_DHT11',
      received_at: new Date().toISOString()
    };
    
    // Store the data
    sensorData.push(sensorReading);
    latestReading = sensorReading;
    lastUpdateTime = new Date().toISOString();
    
    // Keep only last 1000 readings to prevent memory issues
    if (sensorData.length > 1000) {
      sensorData = sensorData.slice(-1000);
    }
    
    console.log('Received sensor data:', {
      temperature: sensorReading.temperature,
      humidity: sensorReading.humidity,
      status: sensorReading.status,
      timestamp: sensorReading.timestamp.toLocaleString()
    });
    
    // Broadcast to WebSocket clients
    broadcastToClients(sensorReading);
    
    res.json({
      success: true,
      message: 'Data received successfully',
      data: sensorReading
    });
    
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get latest sensor reading
app.get('/api/sensor-data/latest', (req, res) => {
  if (!latestReading) {
    return res.status(404).json({
      error: 'No sensor data available'
    });
  }
  
  res.json({
    success: true,
    data: latestReading,
    lastUpdate: lastUpdateTime
  });
});

// Get all sensor data with optional time range filtering
app.get('/api/sensor-data', (req, res) => {
  try {
    const { timeRange, limit } = req.query;
    let filteredData = [...sensorData];
    
    // Filter by time range
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      const hours = timeRange === '1h' ? 1 : timeRange === '3h' ? 3 : 6;
      const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
      
      filteredData = filteredData.filter(item => 
        new Date(item.timestamp) >= cutoff
      );
    }
    
    // Limit results
    if (limit) {
      const limitNum = parseInt(limit);
      filteredData = filteredData.slice(-limitNum);
    }
    
    res.json({
      success: true,
      data: filteredData,
      count: filteredData.length,
      lastUpdate: lastUpdateTime
    });
    
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get connection status
app.get('/api/status', (req, res) => {
  const now = new Date();
  const isConnected = lastUpdateTime && 
    (now.getTime() - new Date(lastUpdateTime).getTime()) < 60000; // Consider connected if data received within last minute
  
  res.json({
    success: true,
    connected: isConnected,
    lastUpdate: lastUpdateTime,
    totalReadings: sensorData.length,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 ESP8266 DHT11 Backend Server running on port ${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});