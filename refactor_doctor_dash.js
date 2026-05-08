const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/doctor/DoctorDashboard.jsx', 'utf-8');

  // DoctorDashboard has a sidebar and header in Stitch, so we need to extract main
  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag in DoctorDashboard.jsx');
    process.exit(1);
  }
  let mainContent = mainMatch[1];
  
  // Replace static name
  mainContent = mainContent.replace('Good Morning, Dr. Thorne', 'Good Morning, Dr. {user?.lastName || "Doctor"}');

  // Replace today's appointments table logic
  const tableMatch = mainContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (tableMatch) {
    const dynamicTable = `
<tbody className="divide-y divide-outline-variant/20">
  {loading ? (
    <tr><td colSpan="5" className="text-center py-8">Loading queue...</td></tr>
  ) : consultations.length === 0 ? (
    <tr><td colSpan="5" className="text-center py-8">No appointments today.</td></tr>
  ) : (
    consultations.map((cons, i) => (
      <tr key={cons._id || i} className="hover:bg-primary/5 transition-colors group">
        <td className="px-gutter py-5 font-bold text-on-surface">{cons.timeSlot || '10:00 AM'}</td>
        <td className="px-gutter py-5 font-bold text-on-surface">{cons.patientId?.firstName} {cons.patientId?.lastName}</td>
        <td className="px-gutter py-5 font-body-sm text-on-surface-variant">{cons.reason || 'General Consultation'}</td>
        <td className="px-gutter py-5">
          <span className={\`font-label text-[10px] uppercase px-xs py-1 rounded-sm \${cons.status === 'scheduled' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}\`}>
            {cons.status || 'scheduled'}
          </span>
        </td>
        <td className="px-gutter py-5 text-right">
          <Link to={\`/doctor/consultation?id=\${cons._id}\`} className="bg-primary text-on-primary font-bold px-md py-xs rounded-lg shadow-sm hover:shadow-md transition-all">Start</Link>
        </td>
      </tr>
    ))
  )}
</tbody>`;
    mainContent = mainContent.replace(tableMatch[0], dynamicTable);
  }

  const newCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/doctor/consultations', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setConsultations(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load patient queue');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  return (
    <div className="w-full animate-fade-in">
      ${mainContent}
    </div>
  );
};

export default DoctorDashboard;
`;

  fs.writeFileSync('client/src/pages/doctor/DoctorDashboard.jsx', newCode);
  console.log('Successfully refactored DoctorDashboard.jsx');
} catch(e) {
  console.error(e);
}
