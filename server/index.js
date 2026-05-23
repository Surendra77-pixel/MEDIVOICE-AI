require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Connect to Database (non-blocking for serverless)
connectDB().catch(err => logger.error('Initial DB connection failed:', err.message));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*.openstreetmap.org", "https://*.tile.osm.org"],
      connectSrc: ["'self'", "https://router.huggingface.co", "https://api-inference.huggingface.co", "https://*.tile.osm.org"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));


// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error('Database connection failed on request:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable. Please try again in a moment.'
    });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/reminders', reminderRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Base API Route
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    message: 'MediVoice AI API v1',
    version: '1.0.0'
  });
});

// Serve static assets in production (non-Vercel deployments like Render)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else if (process.env.NODE_ENV !== 'production') {
  // Friendly message for root in development
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'MediVoice AI API Server is running in development mode',
      frontendDevServer: 'http://localhost:5173',
      apiRoot: '/api/v1',
      healthCheck: '/health'
    });
  });
}

// Global Error Handler
app.use(errorHandler);

// Start Server (only when NOT on Vercel — Vercel uses the exported app)
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  const http = require('http');
  const { Server } = require('socket.io');
  const notificationService = require('./services/notificationService');

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Initialize Services
  notificationService.init(io);

  // Socket Connection Handling
  io.on('connection', (socket) => {
    logger.info(`New socket connected: ${socket.id}`);
    
    socket.on('join_consultation', (consultationId) => {
      socket.join(`consultation_${consultationId}`);
      logger.info(`Socket ${socket.id} joined room consultation_${consultationId}`);
    });

    socket.on('join', (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined their notification room`);
    });

    socket.on('joinRole', (role) => {
      socket.join(role);
      logger.info(`User joined role room: ${role}`);
    });
    
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    if (server.listening) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

module.exports = app;
