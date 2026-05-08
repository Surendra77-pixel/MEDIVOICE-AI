require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');
const logger = require('../config/logger');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@medivoice.ai';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      firstName: 'Platform',
      lastName: 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@MediVoice2026',
      role: 'admin',
      isVerified: true,
      isActive: true,
      city: 'Hyderabad'
    });

    await admin.save();
    logger.info('Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
