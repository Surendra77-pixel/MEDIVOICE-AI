const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const SecurityLog = require('../models/SecurityLog');

/**
 * analyticsService
 * Aggregates platform and clinical data.
 */
class AnalyticsService {
  /**
   * Get Platform Stats for Admin
   */
  async getAdminStats() {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      recentAlerts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      SecurityLog.countDocuments({ event: { $regex: /fail|block|attack/i } })
    ]);

    // Calculate growth (Mock comparison for now)
    return {
      overview: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        recentAlerts
      },
      growth: [
        { name: 'Jan', users: totalUsers - 50 },
        { name: 'Feb', users: totalUsers - 30 },
        { name: 'Mar', users: totalUsers }
      ]
    };
  }

  /**
   * Get Clinical Stats for Doctor
   */
  async getDoctorStats(doctorId) {
    const appointments = await Appointment.find({ doctor: doctorId });
    const consultations = await Consultation.find({ doctor: doctorId });

    const riskDistribution = consultations.reduce((acc, curr) => {
      acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPatients: new Set(consultations.map(c => c.patient.toString())).size,
      totalConsultations: consultations.length,
      avgDuration: '18m', // Mock
      riskDistribution: Object.entries(riskDistribution).map(([name, value]) => ({ name, value }))
    };
  }
}

module.exports = new AnalyticsService();
