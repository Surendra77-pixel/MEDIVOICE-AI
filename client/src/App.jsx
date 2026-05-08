import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import { ROLES } from './constants/roles';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy Loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const OTPVerify = lazy(() => import('./pages/auth/OTPVerify'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Patient Pages
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const AIChatbot = lazy(() => import('./pages/patient/AIChatbot'));
const AppointmentBooking = lazy(() => import('./pages/patient/AppointmentBooking'));
const FindDoctor = lazy(() => import('./pages/patient/FindDoctor'));
const HospitalFinder = lazy(() => import('./pages/patient/HospitalFinder'));
const MedicalHistory = lazy(() => import('./pages/patient/MedicalHistory'));
const Prescriptions = lazy(() => import('./pages/patient/Prescriptions'));
const Reminders = lazy(() => import('./pages/patient/Reminders'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const PatientQueue = lazy(() => import('./pages/doctor/PatientQueue'));
const ConsultationRoom = lazy(() => import('./pages/doctor/ConsultationRoom'));
const ClinicalNotes = lazy(() => import('./pages/doctor/ClinicalNotes'));
const PrescriptionBuilder = lazy(() => import('./pages/doctor/PrescriptionBuilder'));
const ScheduleManager = lazy(() => import('./pages/doctor/ScheduleManager'));
const DoctorAssistant = lazy(() => import('./pages/doctor/DoctorAssistant'));
const DoctorAnalytics = lazy(() => import('./pages/doctor/DoctorAnalytics'));
const PatientProfile = lazy(() => import('./pages/doctor/PatientProfile'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const DoctorVerification = lazy(() => import('./pages/admin/DoctorVerification'));
const SecurityMonitor = lazy(() => import('./pages/admin/SecurityMonitor'));
const SystemLogs = lazy(() => import('./pages/admin/SystemLogs'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.PUBLIC.LANDING} element={<Landing />} />
            
            <Route path={ROUTES.PUBLIC.LOGIN} element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path={ROUTES.PUBLIC.REGISTER} element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            <Route path={ROUTES.PUBLIC.VERIFY_OTP} element={
              <PublicRoute>
                <OTPVerify />
              </PublicRoute>
            } />

            <Route path={ROUTES.PUBLIC.FORGOT_PASSWORD} element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />

            <Route path={ROUTES.PUBLIC.RESET_PASSWORD} element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="chatbot" element={<AIChatbot />} />
              <Route path="find-doctors" element={<FindDoctor />} />
              <Route path="book" element={<AppointmentBooking />} />
              <Route path="hospitals" element={<HospitalFinder />} />
              <Route path="history" element={<MedicalHistory />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="reminders" element={<Reminders />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/consultation/:id" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.PATIENT]}>
                <ConsultationRoom />
              </ProtectedRoute>
            } />
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <DoctorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="queue" element={<PatientQueue />} />
              <Route path="notes" element={<ClinicalNotes />} />
              <Route path="prescriptions" element={<PrescriptionBuilder />} />
              <Route path="schedule" element={<ScheduleManager />} />
              <Route path="assistant" element={<DoctorAssistant />} />
              <Route path="analytics" element={<DoctorAnalytics />} />
              <Route path="patient/:id" element={<PatientProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="doctors" element={<DoctorVerification />} />
              <Route path="security" element={<SecurityMonitor />} />
              <Route path="logs" element={<SystemLogs />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
