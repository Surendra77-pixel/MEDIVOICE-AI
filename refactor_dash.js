const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/patient/PatientDashboard.jsx', 'utf-8');

  // Extract everything inside <main ...> and </main>
  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }

  let mainContent = mainMatch[1];
  
  // Replace static name with dynamic user name
  mainContent = mainContent.replace('Welcome back, Alex!', 'Welcome back, {user?.firstName || "Patient"}!');

  // Replace dummy history with a dynamic mapping
  const historyBlockMatch = mainContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (historyBlockMatch) {
    const dynamicHistory = `
<tbody className="divide-y divide-outline-variant/20">
  {appointments.length === 0 ? (
    <tr><td colSpan="4" className="text-center py-8 text-on-surface-variant">No recent appointments found.</td></tr>
  ) : (
    appointments.slice(0, 3).map((apt, i) => (
      <tr key={i} className="hover:bg-primary/5 transition-colors group">
        <td className="px-gutter py-5 font-body-sm text-on-surface">{new Date(apt.date).toLocaleDateString()}</td>
        <td className="px-gutter py-5 font-bold text-on-surface">{apt.type || 'Consultation'}</td>
        <td className="px-gutter py-5 font-body-sm text-on-surface-variant">Dr. {apt.doctorId?.firstName || 'Doctor'}</td>
        <td className="px-gutter py-5 text-right">
          <Link to="/patient/history" className="text-primary font-bold text-body-sm hover:underline flex items-center justify-end gap-1">
            View Details <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </Link>
        </td>
      </tr>
    ))
  )}
</tbody>`;
    mainContent = mainContent.replace(historyBlockMatch[0], dynamicHistory);
  }

  // Create the new component with data fetching
  const newCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await axios.get('http://localhost:3000/api/v1/patient/appointments', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        
        if (res.data.success) {
          setAppointments(res.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="animate-fade-in w-full">
      ${mainContent}
    </div>
  );
};

export default PatientDashboard;
`;

  fs.writeFileSync('client/src/pages/patient/PatientDashboard.jsx', newCode);
  console.log('Successfully refactored PatientDashboard.jsx');
} catch(e) {
  console.error(e);
}
