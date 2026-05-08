const fs = require('fs');

try {
  const filePath = 'client/src/pages/admin/SecurityMonitor.jsx';
  if (!fs.existsSync(filePath)) {
    console.log('SecurityMonitor.jsx not found. Skipping refactor.');
    process.exit(0);
  }

  let code = fs.readFileSync(filePath, 'utf-8');

  // Strip header and aside
  code = code.replace(/<header[\s\S]*?<\/header>/i, '');
  code = code.replace(/<aside[\s\S]*?<\/aside>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  // Replace dummy logs in tbody
  const tbodyMatch = mainContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (tbodyMatch) {
    const dynamicTbody = `
<tbody className="divide-y divide-outline-variant/30">
  {loading ? (
    <tr><td colSpan="6" className="text-center py-8">Loading security logs...</td></tr>
  ) : logs.length === 0 ? (
    <tr><td colSpan="6" className="text-center py-8">No recent security events.</td></tr>
  ) : logs.map((log, i) => (
    <tr key={log._id || i} className="hover:bg-surface-variant/20 transition-colors">
      <td className="p-4 align-top">
        <span className="font-body-sm text-on-surface">{new Date(log.createdAt).toLocaleString()}</span>
      </td>
      <td className="p-4 align-top">
        <span className={\`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider \${log.eventType === 'FAILED_LOGIN' ? 'bg-error/10 text-error' : log.eventType === 'PASSWORD_CHANGE' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}\`}>
          {log.eventType}
        </span>
      </td>
      <td className="p-4 align-top">
        <span className="font-body-sm text-on-surface font-medium">{log.userId?.email || log.userId || 'Unknown'}</span>
        <div className="font-label text-on-surface-variant text-[11px] mt-1">{log.userId?.role || 'user'}</div>
      </td>
      <td className="p-4 align-top">
        <span className="font-body-sm text-on-surface-variant font-mono">{log.ipAddress || '192.168.1.1'}</span>
      </td>
      <td className="p-4 align-top">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">monitor</span>
          <span className="font-body-sm text-on-surface-variant truncate max-w-[150px]">{log.userAgent || 'Chrome / Windows'}</span>
        </div>
      </td>
      <td className="p-4 align-top text-right">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
      </td>
    </tr>
  ))}
</tbody>`;
    mainContent = mainContent.replace(tbodyMatch[0], dynamicTbody);
  }

  const newCode = `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SecurityMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/admin/security-logs', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setLogs(res.data.data.logs || []);
        }
      } catch (err) {
        toast.error('Failed to load security logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="w-full animate-fade-in flex flex-col pt-16 md:pt-0">
      ${mainContent}
    </div>
  );
};

export default SecurityMonitor;
`;

  fs.writeFileSync(filePath, newCode);
  console.log('Successfully refactored SecurityMonitor.jsx');

} catch(e) {
  console.error(e);
}
