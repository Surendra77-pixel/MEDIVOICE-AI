const { body } = require('express-validator');

const startConsultationValidator = [
  body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
  body('patientLanguage').isIn(['hi', 'ta', 'te', 'ml', 'kn', 'bn']).withMessage('Invalid language')
];

const updateSoapNoteValidator = [
  body('subjective').optional().isObject(),
  body('objective').optional().isObject(),
  body('assessment').optional().isObject(),
  body('plan').optional().isObject()
];

module.exports = {
  startConsultationValidator,
  updateSoapNoteValidator
};
