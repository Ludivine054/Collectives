// src/app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set view engine to ejs
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Basic route
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('Failed to connect to MongoDB', err);
});

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


const helmet = require('helmet');
app.use(helmet());

// app.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

// Initialize Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
