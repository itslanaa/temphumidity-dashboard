/*
  ESP8266 + DHT11 Temperature & Humidity Monitoring
  Sends sensor data to Node.js backend every 20 seconds
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// DHT11 Configuration
#define DHT_PIN 2        // GPIO2 (D4 on NodeMCU)
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi SSID
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

// Server Configuration
const char* serverURL = "http://192.168.1.100:3001/api/sensor-data"; // Replace with your server IP

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorInterval = 20000; // 20 seconds

// Status LED (built-in LED)
const int LED_PIN = LED_BUILTIN;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Initialize LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // Turn off LED (inverted logic)
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("ESP8266 DHT11 Sensor Ready!");
  Serial.println("Sending data every 20 seconds...");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Read and send sensor data every 20 seconds
  if (millis() - lastSensorRead >= sensorInterval) {
    readAndSendSensorData();
    lastSensorRead = millis();
  }
  
  delay(1000); // Small delay to prevent excessive CPU usage
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    // Blink LED to indicate successful connection
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_PIN, LOW);  // Turn on LED
      delay(200);
      digitalWrite(LED_PIN, HIGH); // Turn off LED
      delay(200);
    }
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi!");
  }
}

void readAndSendSensorData() {
  // Read sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // Print readings to Serial Monitor
  Serial.println("=== Sensor Reading ===");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  
  // Determine status
  String status = (temperature > 30.0) ? "Abnormal" : "Normal";
  
  // Send data to server
  sendDataToServer(temperature, humidity, status);
}

void sendDataToServer(float temperature, float humidity, String status) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = round(temperature * 10) / 10.0; // Round to 1 decimal
    jsonDoc["humidity"] = round(humidity);
    jsonDoc["status"] = status;
    jsonDoc["timestamp"] = WiFi.getTime(); // Unix timestamp
    jsonDoc["device_id"] = "ESP8266_DHT11_01";
    
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response: ");
      Serial.println(httpResponseCode);
      Serial.print("Server Response: ");
      Serial.println(response);
      
      // Blink LED to indicate successful data transmission
      digitalWrite(LED_PIN, LOW);  // Turn on LED
      delay(100);
      digitalWrite(LED_PIN, HIGH); // Turn off LED
    } else {
      Serial.print("HTTP Error: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send data.");
  }
}