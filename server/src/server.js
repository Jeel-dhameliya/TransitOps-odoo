const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const startCronJobs = require('./utils/cron');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL in environment. Check .env file.');
  process.exit(1);
}

connectDB();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

// Mount the routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips',tripRoutes);
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/fuel', require('./routes/fuelRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));


app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

startCronJobs(); // Start background tasks

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));