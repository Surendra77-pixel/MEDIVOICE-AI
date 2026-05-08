const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

describe('Model Validation Tests', () => {
  it('should validate a valid User', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password@123',
      role: 'patient',
      city: 'Bangalore'
    };
    const user = new User(userData);
    const err = user.validateSync();
    expect(err).toBeUndefined();
  });

  it('should fail User validation without required fields', async () => {
    const user = new User({});
    const err = user.validateSync();
    expect(err.errors.firstName).toBeDefined();
    expect(err.errors.lastName).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.role).toBeDefined();
  });

  it('should validate a valid Patient', async () => {
    const patientData = {
      userId: new mongoose.Types.ObjectId(),
      gender: 'male',
      bloodGroup: 'O+'
    };
    const patient = new Patient(patientData);
    const err = patient.validateSync();
    expect(err).toBeUndefined();
  });

  it('should validate a valid Doctor', async () => {
    const doctorData = {
      userId: new mongoose.Types.ObjectId(),
      specialty: 'Cardiologist',
      qualifications: ['MBBS'],
      city: 'Mumbai',
      availability: {
        workingDays: ['Mon'],
        startTime: '09:00',
        endTime: '17:00'
      }
    };
    const doctor = new Doctor(doctorData);
    const err = doctor.validateSync();
    expect(err).toBeUndefined();
  });
});
