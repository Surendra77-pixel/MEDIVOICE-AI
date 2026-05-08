const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

dotenv.config({ path: path.join(__dirname, '../.env') });

const doctorsData = [
  {
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun.cardio@medivoice.ai',
    specialty: 'Cardiologist',
    bio: 'Senior Cardiologist with 15 years of experience in interventional cardiology.',
    experienceYears: 15,
    city: 'Hyderabad'
  },
  {
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.neuro@medivoice.ai',
    specialty: 'Neurologist',
    bio: 'Expert in neurodegenerative disorders and stroke management.',
    experienceYears: 12,
    city: 'Bangalore'
  },
  {
    firstName: 'Vikram',
    lastName: 'Mehta',
    email: 'vikram.peds@medivoice.ai',
    specialty: 'Pediatrician',
    bio: 'Dedicated to child health and developmental wellness.',
    experienceYears: 8,
    city: 'Mumbai'
  },
  {
    firstName: 'Ananya',
    lastName: 'Iyer',
    email: 'ananya.ortho@medivoice.ai',
    specialty: 'Orthopedist',
    bio: 'Specialist in sports medicine and joint replacement surgery.',
    experienceYears: 10,
    city: 'Chennai'
  },
  {
    firstName: 'Siddharth',
    lastName: 'Verma',
    email: 'siddharth.derm@medivoice.ai',
    specialty: 'Dermatologist',
    bio: 'Focuses on clinical dermatology and aesthetic skin treatments.',
    experienceYears: 7,
    city: 'Delhi'
  },
  {
    firstName: 'Kavita',
    lastName: 'Reddy',
    email: 'kavita.gp@medivoice.ai',
    specialty: 'General Physician',
    bio: 'Comprehensive family medicine and preventive care specialist.',
    experienceYears: 20,
    city: 'Vijayawada'
  }
];

const seedDoctors = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const doc of doctorsData) {
      // Check if user exists
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          password: 'password123',
          role: 'doctor',
          isEmailVerified: true
        });
        console.log(`Created user: ${doc.email}`);
      }

      // Check if doctor profile exists
      let doctorProfile = await Doctor.findOne({ userId: user._id });
      if (!doctorProfile) {
        await Doctor.create({
          userId: user._id,
          specialty: doc.specialty,
          qualifications: ['MBBS', 'MD'],
          experienceYears: doc.experienceYears,
          city: doc.city,
          bio: doc.bio,
          consultationFee: 120,
          isVerified: true,
          status: 'available',
          registrationNumber: `REG-${Math.floor(Math.random() * 100000)}`
        });
        console.log(`Created doctor profile for: ${doc.specialty}`);
      } else {
        // Update existing to ensure they match UI
        doctorProfile.specialty = doc.specialty;
        doctorProfile.isVerified = true;
        doctorProfile.status = 'available';
        doctorProfile.city = doc.city;
        await doctorProfile.save();
        console.log(`Updated doctor profile: ${doc.specialty}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDoctors();
