const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const projectRoutes = require('./routes/projectRoutes');

// Initialize Express app - MUST COME FIRST
const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, you can specify allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-frontend.vercel.app' // Add your frontend URL later
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Middleware
app.use(cors());  // Use simple CORS for now, fix later
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'EcoTrack Backend API',
    version: '1.0.0',
    endpoints: {
      projects: {
        GET_ALL: 'GET /api/projects',
        GET_ONE: 'GET /api/projects/:id',
        CREATE: 'POST /api/projects',
        UPDATE: 'PATCH /api/projects/:id',
        DELETE: 'DELETE /api/projects/:id'
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}`);
      console.log('📡 Database Connected');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;