require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const connectDB = require('../config/database');

const seedRelationships = async () => {
  try {
    await connectDB();

    console.log('Fetching users...');
    const patientUsers = await User.find({ role: 'patient' });
    let doctorUsers = await User.find({ email: 'surendramntr@gmail.com' });
    if (doctorUsers.length === 0) {
      doctorUsers = await User.find({ role: 'doctor' }).limit(5);
    }

    if (patientUsers.length === 0 || doctorUsers.length === 0) {
      console.log('Not enough patients or doctors to create relationships. Ensure you have seeded/created them.');
      process.exit(1);
    }

    console.log(`Found ${patientUsers.length} patients and ${doctorUsers.length} doctors.`);

    // Clear existing relationship data to avoid massive duplication
    await Appointment.deleteMany({});
    await Consultation.deleteMany({});
    await Prescription.deleteMany({});

    console.log('Cleared existing relationships.');

    for (let i = 0; i < patientUsers.length; i++) {
      const patient = patientUsers[i];
      const doctor = doctorUsers[i % doctorUsers.length];

      // 1. Create a future appointment (confirmed)
      const futureApt = await Appointment.create({
        patientId: patient._id,
        doctorId: doctor._id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        chiefComplaint: 'Fever and Headache',
        patientRiskLevel: 'YELLOW',
        status: 'confirmed'
      });

      // 2. Create a past appointment and consultation
      const pastAptObj = new Appointment({
        patientId: patient._id,
        doctorId: doctor._id,
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        chiefComplaint: 'Cough and Cold',
        patientRiskLevel: 'GREEN',
        status: 'completed'
      });
      await pastAptObj.save({ validateBeforeSave: false });
      const pastApt = pastAptObj;

      const consultation = await Consultation.create({
        appointmentId: pastApt._id,
        patientId: patient._id,
        doctorId: doctor._id,
        patientLanguage: 'hi',
        doctorLanguage: 'en',
        status: 'completed',
        startedAt: new Date(pastApt.scheduledAt),
        completedAt: new Date(pastApt.scheduledAt.getTime() + 30 * 60000),
        actualDurationMinutes: 30,
        transcript: [
          { speaker: 'Patient', originalText: 'I have a bad cough.', timestamp: new Date(pastApt.scheduledAt.getTime() + 1000) },
          { speaker: 'Doctor', originalText: 'Let me prescribe some syrup.', timestamp: new Date(pastApt.scheduledAt.getTime() + 2000) }
        ],
        soapNote: {
          subjective: 'Patient complains of severe cough.',
          objective: 'Throat is red.',
          assessment: 'Viral Pharyngitis',
          plan: 'Rest and cough syrup.',
          doctorConfirmed: true,
          confirmedAt: new Date(pastApt.scheduledAt.getTime() + 30 * 60000)
        }
      });

      pastApt.consultationId = consultation._id;
      await pastApt.save({ validateBeforeSave: false });

      // 3. Create a Prescription
      await Prescription.create({
        consultationId: consultation._id,
        patientId: patient._id,
        doctorId: doctor._id,
        patientSnapshot: {
          name: patient.firstName + ' ' + patient.lastName,
          age: 30,
          gender: 'male'
        },
        doctorSnapshot: {
          name: doctor.firstName + ' ' + doctor.lastName,
          specialty: 'General Physician'
        },
        diagnosis: 'Viral Pharyngitis',
        medications: [{
          drugName: 'Cough Syrup',
          dosage: '10ml',
          frequency: 'Twice a day',
          durationDays: 5,
          instructions: 'Take after meals'
        }],
        status: 'active',
        issuedAt: new Date(pastApt.scheduledAt.getTime() + 30 * 60000),
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      });

      // 4. Create an Appointment for Today (shows up in Patient Queue)
      const todayApt = await Appointment.create({
        patientId: patient._id,
        doctorId: doctor._id,
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60), // In 1 hour
        chiefComplaint: 'Follow up',
        patientRiskLevel: 'GREEN',
        status: 'confirmed'
      });

      console.log(`Created relationships for Patient: ${patient.email} with Doctor: ${doctor.email}`);
    }

    console.log('Seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding relationships:', error);
    process.exit(1);
  }
};

seedRelationships();
