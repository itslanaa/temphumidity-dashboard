# ESP8266 DHT11 Temperature & Humidity Monitoring Dashboard

A real-time IoT dashboard for monitoring temperature and humidity using ESP8266 microcontroller with DHT11 sensor.

## 🌟 Features

- **Real-time Data**: Live sensor readings every 20 seconds
- **Modern UI**: Clean, responsive dashboard with dark/light theme
- **Interactive Charts**: Temperature and humidity trend visualization
- **Status Monitoring**: Connection status and sensor health indicators
- **Data Export**: CSV export functionality for data analysis
- **Time Filtering**: View data for different time ranges (1h, 3h, 6h, all)
- **WebSocket Support**: Real-time updates with fallback to HTTP polling

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Real-time**: WebSocket connection with HTTP fallback

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Real-time**: WebSocket server for live updates
- **API**: RESTful endpoints for data management
- **CORS**: Cross-origin support for frontend integration

### Hardware
- **Microcontroller**: ESP8266 (NodeMCU/Wemos D1 Mini)
- **Sensor**: DHT11 Temperature & Humidity Sensor
- **Connectivity**: WiFi for data transmission

## 🚀 Quick Start

### 1. Hardware Setup

**Components needed:**
- ESP8266 development board (NodeMCU/Wemos D1 Mini)
- DHT11 temperature and humidity sensor
- Jumper wires
- Breadboard (optional)

**Wiring:**
- DHT11 VCC → ESP8266 3.3V
- DHT11 GND → ESP8266 GND  
- DHT11 DATA → ESP8266 GPIO2 (D4 on NodeMCU)

### 2. Arduino Setup

1. Install Arduino IDE
2. Install ESP8266 board package
3. Install required libraries:
   ```
   - DHT sensor library by Adafruit
   - ArduinoJson by Benoit Blanchon
   ```
4. Open `arduino/esp8266_dht11.ino`
5. Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
6. Update server URL with your computer's IP:
   ```cpp
   const char* serverURL = "http://192.168.1.100:3001/api/sensor-data";
   ```
7. Upload the sketch to ESP8266

### 3. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   
   For development:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The dashboard will be available at `http://localhost:5173`

## 📡 API Endpoints

### Backend API

- `POST /api/sensor-data` - Receive data from ESP8266
- `GET /api/sensor-data/latest` - Get latest sensor reading
- `GET /api/sensor-data` - Get all sensor data with filtering
- `GET /api/status` - Get connection status
- `GET /api/health` - Health check endpoint

### WebSocket

Real-time updates are broadcast via WebSocket on the same port as the HTTP server.

## 🔧 Configuration

### ESP8266 Configuration
Update these values in the Arduino sketch:
- WiFi SSID and password
- Server IP address and port
- Sensor pin (default: GPIO2)
- Update interval (default: 20 seconds)

### Backend Configuration
Environment variables (optional):
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Frontend Configuration
Update API endpoints in `src/hooks/useTemperatureData.ts`:
- `API_BASE_URL` - Backend API URL
- `WS_URL` - WebSocket URL

## 📊 Data Format

Sensor data is transmitted in JSON format:
```json
{
  "temperature": 29.5,
  "humidity": 72,
  "status": "Normal",
  "timestamp": 1640995200,
  "device_id": "ESP8266_DHT11_01"
}
```

## 🛠️ Troubleshooting

### ESP8266 Issues
- Check WiFi credentials and network connectivity
- Verify server IP address and port
- Monitor Serial output for debugging
- Ensure DHT11 is properly wired

### Backend Issues
- Check if port 3001 is available
- Verify CORS settings for frontend domain
- Monitor console logs for errors

### Frontend Issues
- Ensure backend server is running
- Check browser console for errors
- Verify API endpoints are accessible

## 📈 Features in Detail

### Real-time Monitoring
- Automatic data updates every 20 seconds
- WebSocket connection for instant updates
- Connection status indicators

### Data Visualization
- Interactive line charts for temperature and humidity
- Time range filtering (1h, 3h, 6h, all data)
- Responsive design for all screen sizes

### Status Alerts
- Normal/Abnormal temperature status (threshold: 30°C)
- Connection status monitoring
- Visual indicators for sensor health

### Data Management
- CSV export functionality
- Data retention and cleanup
- Historical data storage

## 🎨 UI Components

- **Header**: App title and theme toggle
- **Connection Status**: Real-time connection indicator
- **Status Cards**: Current temperature, humidity, and status
- **Controls**: Time range filter, refresh, and export buttons
- **Chart**: Interactive temperature and humidity trends
- **Data Summary**: Statistics and readings count

## 🌙 Theme Support

The dashboard supports both light and dark themes with:
- Automatic system preference detection
- Manual theme toggle
- Consistent styling across all components

## 📱 Responsive Design

Optimized for all devices:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop computers (1024px+)

## 🔒 Security Considerations

- CORS configuration for allowed origins
- Input validation on backend
- Error handling and graceful degradation
- No sensitive data exposure

## 🚀 Deployment

### Backend Deployment
- Can be deployed to any Node.js hosting service
- Update CORS origins for production domain
- Set appropriate environment variables

### Frontend Deployment
- Build for production: `npm run build`
- Deploy to static hosting (Netlify, Vercel, etc.)
- Update API endpoints for production backend

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For questions and support, please open an issue in the repository.