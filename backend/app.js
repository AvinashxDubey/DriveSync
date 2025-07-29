const express = require('express');
const connectDb = require('./config/connectDb');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const updatePackageRoutes = require('./routes/updatePackageRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config();
connectDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/log', logRoutes);
app.use('/api/update', updatePackageRoutes);
app.use('/api/vehicle', vehicleRoutes);

app.get('/', (req, res)=> {
    res.json({message: 'backend is running...'});
});

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});