const helmet = require('helmet');
const cors = require('cors');

const securityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Handle preflight
  app.options('*', cors());
};

module.exports = securityMiddleware;
