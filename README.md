# Dashboard Monitoring Suhu & Kelembaban ESP8266 DHT11

Dashboard IoT real-time untuk monitoring suhu dan kelembaban menggunakan mikrokontroler ESP8266 dengan sensor DHT11.

## 🌟 Fitur

- **Data Real-time**: Pembacaan sensor langsung setiap 20 detik
- **UI Modern**: Dashboard yang bersih dan responsif dengan tema gelap/terang
- **Grafik Interaktif**: Visualisasi tren suhu dan kelembaban
- **Monitoring Status**: Indikator status koneksi dan kesehatan sensor
- **Ekspor Data**: Fungsi ekspor CSV untuk analisis data
- **Filter Waktu**: Lihat data untuk rentang waktu berbeda (1j, 3j, 6j, semua)
- **Dukungan WebSocket**: Update real-time dengan fallback ke HTTP polling

## 🏗️ Arsitektur

### Frontend (React + TypeScript)
- **Framework**: React 18 dengan TypeScript
- **Styling**: Tailwind CSS untuk desain responsif
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Real-time**: Koneksi WebSocket dengan fallback HTTP

### Backend (Node.js)
- **Runtime**: Node.js dengan Express.js
- **Real-time**: Server WebSocket untuk update langsung
- **API**: Endpoint RESTful untuk manajemen data
- **CORS**: Dukungan cross-origin untuk integrasi frontend

### Hardware
- **Mikrokontroler**: ESP8266 (NodeMCU/Wemos D1 Mini)
- **Sensor**: Sensor Suhu & Kelembaban DHT11
- **Konektivitas**: WiFi untuk transmisi data

## 🚀 Panduan Cepat

### 1. Setup Hardware

**Komponen yang dibutuhkan:**
- Board pengembangan ESP8266 (NodeMCU/Wemos D1 Mini)
- Sensor suhu dan kelembaban DHT11
- Kabel jumper
- Breadboard (opsional)

**Wiring:**
- DHT11 VCC → ESP8266 3.3V
- DHT11 GND → ESP8266 GND  
- DHT11 DATA → ESP8266 GPIO2 (D4 pada NodeMCU)

### 2. Setup Arduino

1. Install Arduino IDE
2. Install paket board ESP8266
3. Install library yang diperlukan:
   ```
   - DHT sensor library by Adafruit
   - ArduinoJson by Benoit Blanchon
   ```
4. Buka `arduino/esp8266_dht11.ino`
5. Update kredensial WiFi:
   ```cpp
   const char* ssid = "NAMA_WIFI_ANDA";
   const char* password = "PASSWORD_WIFI_ANDA";
   ```
6. Update URL server dengan IP komputer Anda:
   ```cpp
   const char* serverURL = "http://192.168.1.100:3001/api/sensor-data";
   ```
7. Upload sketch ke ESP8266

### 3. Setup Backend

1. Navigasi ke direktori backend:
   ```bash
   cd backend
   npm install
   ```

2. Jalankan server:
   ```bash
   npm start
   ```
   
   Untuk development:
   ```bash
   npm run dev
   ```

Backend akan berjalan di `http://localhost:3001`

### 4. Setup Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

Dashboard akan tersedia di `http://localhost:5173`

## 📡 Endpoint API

### Backend API

- `POST /api/sensor-data` - Menerima data dari ESP8266
- `GET /api/sensor-data/latest` - Mendapatkan pembacaan sensor terbaru
- `GET /api/sensor-data` - Mendapatkan semua data sensor dengan filtering
- `GET /api/status` - Mendapatkan status koneksi
- `GET /api/health` - Endpoint health check

### WebSocket

Update real-time disiarkan melalui WebSocket pada port yang sama dengan server HTTP.

## 🔧 Konfigurasi

### Konfigurasi ESP8266
Update nilai-nilai ini dalam sketch Arduino:
- SSID dan password WiFi
- Alamat IP dan port server
- Pin sensor (default: GPIO2)
- Interval update (default: 20 detik)

### Konfigurasi Backend
Variabel environment (opsional):
- `PORT` - Port server (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Konfigurasi Frontend
Update endpoint API di `src/hooks/useTemperatureData.ts`:
- URL API backend
- URL WebSocket

## 📊 Format Data

Data sensor dikirim dalam format JSON:
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

### Masalah ESP8266
- Periksa kredensial WiFi dan konektivitas jaringan
- Verifikasi alamat IP dan port server
- Monitor output Serial untuk debugging
- Pastikan DHT11 terhubung dengan benar

### Masalah Backend
- Periksa apakah port 3001 tersedia
- Verifikasi pengaturan CORS untuk domain frontend
- Monitor log konsol untuk error

### Masalah Frontend
- Pastikan server backend berjalan
- Periksa konsol browser untuk error
- Verifikasi endpoint API dapat diakses

## 📈 Detail Fitur

### Monitoring Real-time
- Update data otomatis setiap 20 detik
- Koneksi WebSocket untuk update instan
- Indikator status koneksi

### Visualisasi Data
- Grafik garis interaktif untuk suhu dan kelembaban
- Filter rentang waktu (1j, 3j, 6j, semua data)
- Desain responsif untuk semua ukuran layar

### Alert Status
- Status suhu Normal/Abnormal (ambang batas: 30°C)
- Monitoring status koneksi
- Indikator visual untuk kesehatan sensor

### Manajemen Data
- Fungsi ekspor CSV
- Retensi dan pembersihan data
- Penyimpanan data historis

## 🎨 Komponen UI

- **Header**: Judul aplikasi dan toggle tema
- **Status Koneksi**: Indikator koneksi real-time
- **Kartu Status**: Suhu, kelembaban, dan status saat ini
- **Kontrol**: Filter rentang waktu, refresh, dan tombol ekspor
- **Grafik**: Tren suhu dan kelembaban interaktif
- **Ringkasan Data**: Statistik dan jumlah pembacaan

## 🌙 Dukungan Tema

Dashboard mendukung tema terang dan gelap dengan:
- Deteksi preferensi sistem otomatis
- Toggle tema manual
- Styling konsisten di semua komponen

## 📱 Desain Responsif

Dioptimalkan untuk semua perangkat:
- Ponsel (320px+)
- Tablet (768px+)
- Komputer desktop (1024px+)

## 🔒 Pertimbangan Keamanan

- Konfigurasi CORS untuk origin yang diizinkan
- Validasi input pada backend
- Penanganan error dan degradasi yang baik
- Tidak ada eksposur data sensitif

## 🚀 Deployment

### Deployment Backend
- Dapat di-deploy ke layanan hosting Node.js mana pun
- Update origin CORS untuk domain produksi
- Set variabel environment yang sesuai

### Deployment Frontend
- Build untuk produksi: `npm run build`
- Deploy ke hosting statis (Netlify, Vercel, dll.)
- Update endpoint API untuk backend produksi
