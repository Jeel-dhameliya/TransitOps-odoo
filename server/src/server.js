const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Connect to the database
connectDB();

// 3. Initialize Express
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

// 4. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});