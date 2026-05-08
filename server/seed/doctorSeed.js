require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const connectDB = require('../config/database');
const logger = require('../config/logger');

const SEED_SPECIALTIES = [
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Orthopedist',
  'Dermatologist',
];

const SEED_CITIES = [
  'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
  'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
];

const seedDoctors = async () => {
  try {
    await connectDB();

    // Clear existing doctors to avoid duplicates during seed
    const doctorUsers = await User.find({ role: 'doctor' });
    const doctorUserIds = doctorUsers.map(u => u._id);
    await Doctor.deleteMany({ userId: { $in: doctorUserIds } });
    await User.deleteMany({ role: 'doctor' });

    const doctorsToCreate = [];

    for (const city of SEED_CITIES) {
      for (const specialty of SEED_SPECIALTIES) {
        const firstName = `Dr. ${specialty.split(' ')[0]}`;
        const lastName = city;
        const email = `dr.${firstName.toLowerCase().replace(/[\s.]/g, '')}.${lastName.toLowerCase().replace(/\s/g, '')}@medivoice.dev`;

        const user = new User({
          firstName,
          lastName,
          email,
          password: 'Doctor@2026',
          role: 'doctor',
          city,
          isVerified: true,
          isActive: true
        });

        const savedUser = await user.save();

        const doctorProfile = new Doctor({
          userId: savedUser._id,
          specialty,
          qualifications: ['MBBS', 'MD'],
          experienceYears: Math.floor(Math.random() * 20) + 5,
          registrationNumber: `MCI-${city.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
          city,
          consultationFee: Math.floor(Math.random() * 500) + 200,
          languagesSpoken: ['en', 'hi'],
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          totalRatings: Math.floor(Math.random() * 100),
          isVerified: true,
          status: 'available',
          availability: {
            workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            startTime: '09:00',
            endTime: '17:00',
            slotDurationMinutes: 30,
            maxDailySlots: 16
          }
        });

        await doctorProfile.save();
        logger.info(`Seeded doctor: ${email}`);
      }
    }

    logger.info('Doctor seeding complete');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding doctors: ${error.message}`);
    process.exit(1);
  }
};

seedDoctors();
