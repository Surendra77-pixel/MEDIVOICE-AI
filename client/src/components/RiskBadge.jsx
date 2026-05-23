import React from 'react';

const RiskBadge = ({ riskData }) => {
  if (!riskData) return null;

  const config = {
    RED:    { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', label: '🔴 DANGER',   border: 'rgba(239, 68, 68, 0.3)' },
    YELLOW: { color: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', label: '🟡 MODERATE', border: 'rgba(234, 179, 8, 0.3)' },
    GREEN:  { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', label: '🟢 SAFE',     border: 'rgba(34, 197, 94, 0.3)' }
  };

  const { color, bg, label, border } = config[riskData.riskLevel] || config.YELLOW;

  return (
    <div className="mt-4 p-4 rounded-2xl backdrop-blur-md shadow-sm transition-all" style={{ background: bg, border: `1px solid ${border}` }}>
      <div style={{ color }} className="font-black tracking-widest uppercase text-sm mb-2">{label}</div>
      <p className="text-sm text-slate-300 dark:text-gray-300 leading-relaxed mb-3">{riskData.riskReason}</p>
      
      <div className="bg-black/20 rounded-lg p-3">
        <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
          Action Required: <span style={{ color }}>{riskData.urgency}</span>
        </p>
        
        {riskData.recommendations?.length > 0 && (
          <ul className="space-y-1">
            {riskData.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-slate-400 dark:text-gray-400 flex items-start gap-2">
                <span style={{ color }}>•</span> {r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RiskBadge;
