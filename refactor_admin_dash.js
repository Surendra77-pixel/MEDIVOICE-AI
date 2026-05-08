const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/admin/AdminDashboard.jsx', 'utf-8');

  // Strip header and aside
  code = code.replace(/<aside[\s\S]*?<\/aside>/i, '');
  code = code.replace(/<header[\s\S]*?<\/header>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  // Inject dynamic variables
  mainContent = mainContent.replace(
    /<h2 className="font-h2 text-h2 text-on-surface mt-xs">12,840<\/h2>/,
    `<h2 className="font-h2 text-h2 text-on-surface mt-xs">{stats?.totalUsers || '0'}</h2>`
  );

  mainContent = mainContent.replace(
    /<h2 className="font-h2 text-h2 text-on-surface mt-xs">4,215<\/h2>/,
    `<h2 className="font-h2 text-h2 text-on-surface mt-xs">{stats?.totalConsultations || '0'}</h2>`
  );

  mainContent = mainContent.replace(
    /<h2 className="font-h2 text-h2 text-on-surface mt-xs">28<\/h2>/,
    `<h2 className="font-h2 text-h2 text-on-surface mt-xs">{stats?.recentSecurityEvents || '0'}</h2>`
  );

  const newCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/admin/dashboard', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in w-full">
      ${mainContent}
    </div>
  );
};

export default AdminDashboard;
`;

  fs.writeFileSync('client/src/pages/admin/AdminDashboard.jsx', newCode);
  console.log('Successfully refactored AdminDashboard.jsx');

} catch(e) {
  console.error(e);
}
