/**
 * riskCalculator
 * Pure utility to calculate patient risk levels based on symptoms and vitals.
 */
const CRITICAL_SYMPTOMS = [
  'chest pain', 'shortness of breath', 'difficulty breathing', 
  'unconscious', 'heavy bleeding', 'severe head injury',
  'sudden paralysis', 'slurred speech'
];

const HIGH_RISK_SYMPTOMS = [
  'high fever', 'severe abdominal pain', 'persistent vomiting',
  'blurred vision', 'extreme fatigue', 'irregular heartbeat'
];

const calculateRisk = (symptoms = [], vitals = {}) => {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase());

  // 1. Critical Check
  const hasCritical = lowerSymptoms.some(s => 
    CRITICAL_SYMPTOMS.some(critical => s.includes(critical))
  );
  if (hasCritical) return 'Critical';

  // 2. High Risk Check
  const hasHigh = lowerSymptoms.some(s => 
    HIGH_RISK_SYMPTOMS.some(high => s.includes(high))
  );
  
  // Vitals check (if provided)
  const abnormalVitals = 
    (vitals.temp > 103) || 
    (vitals.bpSys > 160 || vitals.bpSys < 90) ||
    (vitals.spo2 < 92);

  if (hasHigh || abnormalVitals) return 'High';

  // 3. Medium Risk Check
  if (lowerSymptoms.length > 3 || vitals.temp > 100) return 'Medium';

  // 4. Low Risk
  return 'Low';
};

module.exports = { calculateRisk };
