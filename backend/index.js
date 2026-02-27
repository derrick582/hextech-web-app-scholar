require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(cors());
app.use(express.json());

// Set socket.io to app to use in routes
app.set('io', io);

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

app.get('/API/health', (req, res) => {
  res.json({
    status: 'active',
    node: 'HEX-CORE-01',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    db_state: mongoose.connection.readyState
  });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'demo') {
  server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
