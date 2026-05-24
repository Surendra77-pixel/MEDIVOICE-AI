const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');

const seedNewUser = async (user) => {
  try {
    const today = new Date();
    today.setHours(today.getHours() + 1); // 1 hour from now

    if (user.role === 'doctor') {
      // Create fake patients for this doctor
      const patients = [
        { first: 'Arthur', last: 'Morgan', risk: 'High', reason: 'Severe headache and hypertension' },
        { first: 'Sadie', last: 'Adler', risk: 'Medium', reason: 'Follow up for asthma' },
        { first: 'John', last: 'Marston', risk: 'Low', reason: 'General checkup' }
      ];

      for (let i = 0; i < patients.length; i++) {
        const p = patients[i];
        
        // Create Patient User
        const pUser = new User({
          firstName: p.first,
          lastName: p.last,
          email: `mock_${p.first.toLowerCase()}_${Date.now()}@example.com`,
          password: 'password123',
          role: 'patient',
          isVerified: true,
          city: 'Hyderabad'
        });
        await pUser.save();
        
        // Create Patient Profile
        await Patient.create({ 
          userId: pUser._id,
          dateOfBirth: new Date(1980, 5, 15),
          gender: 'male',
          bloodGroup: 'O+'
        });
        
        // Create Appointment for today
        const apptTime = new Date();
        apptTime.setHours(apptTime.getHours() + i + 1);
        
        const appt = new Appointment({
          patientId: pUser._id,
          doctorId: user._id,
          scheduledAt: apptTime,
          status: 'confirmed',
          type: i % 2 === 0 ? 'in-person' : 'video',
          reasonForVisit: p.reason,
          riskLevel: p.risk
        });
        await appt.save();
        
        // Create a completed consultation and prescription for the first patient (past data for analytics)
        if (i === 0) {
          const pastAppt = new Appointment({
            patientId: pUser._id,
            doctorId: user._id,
            scheduledAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
            status: 'completed',
            type: 'in-person',
            reasonForVisit: 'Initial consultation',
            riskLevel: 'Medium'
          });
          await pastAppt.save({ validateBeforeSave: false });

          const cons = new Consultation({
            patientId: pUser._id,
            doctorId: user._id,
            appointmentId: pastAppt._id,
            status: 'completed',
            soapNote: {
               subjective: { chiefComplaint: 'Chest pain' },
               assessment: { probableDiagnosis: 'Stress-induced angina' },
               plan: { followUpInstructions: 'Mild angina, prescribed rest and beta blockers.' }
            },
            transcript: [
               { speaker: 'Patient', originalText: 'I have chest pain.' },
               { speaker: 'Doctor', originalText: 'Your BP is normal.' }
            ]
          });
          await cons.save({ validateBeforeSave: false });
        }
      }

    } else if (user.role === 'patient') {
       // Create 1 fake doctor for this patient
       const dUser = new User({
         firstName: 'House',
         lastName: 'MD',
         email: `mockdoc_${Date.now()}@example.com`,
         password: 'password123',
         role: 'doctor',
         isVerified: true,
         city: 'Hyderabad'
       });
       await dUser.save();
       
       await Doctor.create({ 
         userId: dUser._id, 
         specialty: 'General Physician',
         city: 'Hyderabad',
         qualifications: ['MD', 'PhD'],
         clinicName: 'Princeton-Plainsboro',
         rating: 4.8
       });
       
       // Create an upcoming appointment
       const apptTime = new Date();
       apptTime.setDate(apptTime.getDate() + 1); // Tomorrow
       apptTime.setHours(10, 0, 0, 0);

       const appt = new Appointment({
         patientId: user._id,
         doctorId: dUser._id,
         scheduledAt: apptTime,
         status: 'confirmed',
         type: 'video',
         reasonForVisit: 'Unexplained symptoms',
         riskLevel: 'Medium'
       });
       await appt.save();

       // Create a past consultation and prescription
       const pastAppt = new Appointment({
         patientId: user._id,
         doctorId: dUser._id,
         scheduledAt: new Date(Date.now() - 86400000 * 7), // 1 week ago
         status: 'completed',
         type: 'in-person',
         reasonForVisit: 'Headache',
         riskLevel: 'Low'
       });
       await pastAppt.save({ validateBeforeSave: false });

       const cons = new Consultation({
         patientId: user._id,
         doctorId: dUser._id,
         appointmentId: pastAppt._id,
         status: 'completed',
         soapNote: {
            subjective: { chiefComplaint: 'Migraine' },
            assessment: { probableDiagnosis: 'Chronic Migraine' }
         }
       });
       await cons.save({ validateBeforeSave: false });

       const pres = new Prescription({
         consultationId: cons._id,
         patientId: user._id,
         doctorId: dUser._id,
         diagnosis: 'Chronic Migraine',
         doctorSnapshot: {
           name: 'Dr. House MD',
           specialty: 'Diagnostic Medicine'
         },
         medications: [
           { drugName: 'Sumatriptan 50mg', dose: '1 tablet', frequency: 'As needed for migraine', duration: '1 month' }
         ],
         status: 'active'
       });
       await pres.save();
    }
    console.log(`[SeedNewUser] Seeded mock data successfully for ${user.role} ${user.email}`);
  } catch(err) {
    console.error(`[SeedNewUser] Failed to seed data for ${user.email}:`, err);
  }
};

module.exports = seedNewUser;
