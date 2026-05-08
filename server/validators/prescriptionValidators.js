const { body } = require('express-validator');

const createPrescriptionValidator = [
  body('consultationId').isMongoId().withMessage('Invalid consultation ID'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  body('medications.*.drugName').trim().notEmpty().withMessage('Drug name is required'),
  body('medications.*.dose').trim().notEmpty().withMessage('Dose is required'),
  body('medications.*.frequency').trim().notEmpty().withMessage('Frequency is required'),
  body('medications.*.duration').trim().notEmpty().withMessage('Duration is required')
];

module.exports = {
  createPrescriptionValidator
};
