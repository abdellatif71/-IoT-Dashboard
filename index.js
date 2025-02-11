const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let data = [];

// Simulate real-time data generation
setInterval(() => {
  const newData = {
    time: new Date().toLocaleTimeString(),
    temperature: Math.floor(Math.random() * 30) + 10,  // Random temperature between 10-40°C
    humidity: Math.floor(Math.random() * 50) + 30     // Random humidity between 30-80%
  };
  data.push(newData);
  if (data.length > 10) data.shift();  // Keep last 10 records
  io.emit('updateData', data);
}, 2000);

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
