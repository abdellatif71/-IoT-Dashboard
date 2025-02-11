IoT Dashboard Application

This application is a real-time IoT dashboard built using Node.js, Express, and Socket.io. It visualizes temperature and humidity data using Chart.js, providing a dynamic and interactive interface.

Features

Real-Time Data Visualization: Displays temperature and humidity data updated every 2 seconds.

Interactive Charts: Uses Chart.js to plot live data on line charts.

Simple and Lightweight: All HTML and JavaScript are served inline from the server.

Reset Functionality: Clear data with a single click.

Technologies Used

Node.js: JavaScript runtime environment for the backend.

Express: Web framework for handling server requests.

Socket.io: Enables real-time communication between the server and the client.

Chart.js: Library for creating responsive, interactive charts.

Installation

Clone the repository:

git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

Install dependencies:

npm install express socket.io

Run the application:

node app.js

Access the dashboard:
Open your browser and go to http://localhost:3000.

Usage

Real-Time Monitoring: The dashboard will automatically start displaying real-time temperature and humidity data.

Reset Data: Click the "Reset Data" button to clear the existing data from the charts.

Project Structure

/your-repo-name
|-- app.js         # Main server file containing backend and frontend code
|-- package.json   # Project metadata and dependencies

Contributing

Fork the repository.

Create your feature branch (git checkout -b feature/YourFeature).

Commit your changes (git commit -m 'Add your feature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.

License

This project is licensed under the MIT License.

