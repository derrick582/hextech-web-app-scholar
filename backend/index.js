require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

app.get('/API/health', (req, res) => {
  res.json({
    status: 'active',
    node: 'HEX-CORE-01',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    db_state: mongoose.connection.readyState
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
