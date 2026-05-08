const { body } = require('express-validator');

const createAppointmentValidator = [
  body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  body('scheduledAt').isISO8601().withMessage('Invalid date format'),
  body('chiefComplaint')
    .trim()
    .notEmpty()
    .withMessage('Please describe your concern')
    .isLength({ max: 500 })
    .withMessage('Complaint must be under 500 characters')
];

const updateAppointmentValidator = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'])
    .withMessage('Invalid status'),
  body('cancelReason').optional().trim().notEmpty().withMessage('Cancellation reason is required')
];

module.exports = {
  createAppointmentValidator,
  updateAppointmentValidator
};
