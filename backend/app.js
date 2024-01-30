// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use('/api/user', userRoutes);
app.use('/api/restaurant', restaurantRoutes);
mongoose.connect(process.env.MONGO_DB_URI);

const db = mongoose.connection;

// Check if the connection is successful
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.json('Hello World');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
