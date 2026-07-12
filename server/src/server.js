const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // 1. Import routes

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Body parser must come first!

// 2. Mount the routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});