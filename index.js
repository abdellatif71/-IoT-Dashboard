import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io'; // Hier angepasst
import axios from 'axios'; // Importiere Axios

const app = express();
const server = http.createServer(app);
const io = new socketIo(server); // Socket.io initialisieren

let data = [];

// Dein API-Schlüssel für WeatherAPI.com
const API_KEY = '24f93fa2e3c9426cbb0182915251102';
const LOCATION = 'Paris'; // Du kannst die Location nach Belieben ändern

async function fetchWeatherData() {
  try {
    // Ersetze fetch durch Axios
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}`);
    const weatherData = response.data;
    
    const newData = {
      time: new Date().toLocaleTimeString(),
      temperature: weatherData.current.temp_c, 
      humidity: weatherData.current.humidity  
    };

    data.push(newData);
    if (data.length > 10) data.shift(); 
    io.emit('updateData', data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
  }
}


setInterval(fetchWeatherData, 2000);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>IoT Dashboard</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="/socket.io/socket.io.js"></script>
    </head>
    <body>
      <h1>Real-Time IoT Dashboard</h1>
      <canvas id="temperatureChart" width="400" height="200"></canvas>
      <canvas id="humidityChart" width="400" height="200"></canvas>
      <button onclick="resetData()">Reset Data</button>

      <script>
        const socket = io();
        let temperatureChart;
        let humidityChart;

        socket.on('updateData', (data) => {
          const labels = data.map(item => item.time);
          const tempData = data.map(item => item.temperature);
          const humidityData = data.map(item => item.humidity);

          if (!temperatureChart) {
            const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
            temperatureChart = new Chart(ctxTemp, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Temperature (°C)',
                  data: tempData,
                  borderColor: 'rgba(136, 132, 216, 1)',
                  fill: false
                }]
              }
            });
          } else {
            temperatureChart.data.labels = labels;
            temperatureChart.data.datasets[0].data = tempData;
            temperatureChart.update();
          }

          if (!humidityChart) {
            const ctxHum = document.getElementById('humidityChart').getContext('2d');
            humidityChart = new Chart(ctxHum, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Humidity (%)',
                  data: humidityData,
                  borderColor: 'rgba(130, 202, 157, 1)',
                  fill: false
                }]
              }
            });
          } else {
            humidityChart.data.labels = labels;
            humidityChart.data.datasets[0].data = humidityData;
            humidityChart.update();
          }
        });

        function resetData() {
          socket.emit('resetData');
        }
      </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('updateData', data);

  socket.on('resetData', () => {
    data = [];
    socket.emit('updateData', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
