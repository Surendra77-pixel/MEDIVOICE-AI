const Reminder = require('../models/Reminder');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Create Reminder ─────────────────────────────────────────────────────────
const createReminder = asyncHandler(async (req, res) => {
  const { prescriptionId, drugName, dose, instructions, scheduledTime, startDate, endDate } = req.body;

  if (!drugName || !scheduledTime || !endDate) {
    return apiResponse.error(res, 'drugName, scheduledTime, and endDate are required', 400);
  }

  const start = new Date(startDate || Date.now());
  let end = new Date(endDate);
  
  if (isNaN(end.getTime())) {
    // Try parsing DD/MM/YYYY
    const parts = String(endDate).split('/');
    if (parts.length === 3) {
      end = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }

  if (isNaN(end.getTime())) {
    return apiResponse.error(res, 'Invalid endDate format', 400);
  }

  const daysTotal = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const reminder = await Reminder.create({
    patientId: req.user._id,
    prescriptionId,
    drugName,
    dose,
    instructions,
    scheduledTime,
    startDate: start,
    endDate: end,
    daysTotal,
    notificationTitle: `💊 Time for ${drugName}`,
    notificationBody: `Take ${dose || 'your dose'} of ${drugName}. ${instructions || ''}`
  });

  return apiResponse.success(res, reminder, 'Reminder created', 201);
});

// ─── Get Active Reminders ────────────────────────────────────────────────────
const getReminders = asyncHandler(async (req, res) => {
  const { active } = req.query;
  const query = { patientId: req.user._id };
  if (active !== undefined) query.active = active === 'true';

  const reminders = await Reminder.find(query)
    .populate('prescriptionId', 'diagnosis')
    .sort({ scheduledTime: 1 });

  return apiResponse.success(res, reminders, 'Reminders fetched');
});

// ─── Acknowledge Reminder ────────────────────────────────────────────────────
const acknowledgeReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, patientId: req.user._id });
  if (!reminder) return apiResponse.error(res, 'Reminder not found', 404);

  reminder.lastAcknowledgedAt = new Date();
  reminder.totalAcknowledgements += 1;
  await reminder.save();

  return apiResponse.success(res, reminder, 'Reminder acknowledged');
});

// ─── Update Reminder ─────────────────────────────────────────────────────────
const updateReminder = asyncHandler(async (req, res) => {
  const { scheduledTime, active } = req.body;
  const reminder = await Reminder.findOne({ _id: req.params.id, patientId: req.user._id });
  if (!reminder) return apiResponse.error(res, 'Reminder not found', 404);

  if (scheduledTime) { reminder.scheduledTime = scheduledTime; reminder.customizedTime = true; }
  if (active !== undefined) reminder.active = active;
  await reminder.save();

  return apiResponse.success(res, reminder, 'Reminder updated');
});

// ─── Delete Reminder ─────────────────────────────────────────────────────────
const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, patientId: req.user._id });
  if (!reminder) return apiResponse.error(res, 'Reminder not found', 404);
  return apiResponse.success(res, null, 'Reminder deleted');
});

module.exports = {
  createReminder, getReminders, acknowledgeReminder,
  updateReminder, deleteReminder
};
