import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
   BarChart, 
   Bar, 
   XAxis, 
   YAxis, 
   CartesianGrid, 
   Tooltip, 
   ResponsiveContainer, 
   PieChart, 
   Pie, 
   Cell,
   AreaChart,
   Area
} from 'recharts';
import { 
   Users, 
   Clock, 
   TrendingUp, 
   ArrowUpRight, 
   Filter,
   Download
} from 'lucide-react';

const DoctorAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // 7, 15, or 30 days
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/doctor/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  // Filter consultations based on selected timeRange
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const filteredConsultations = data?.consultationsPerDay?.filter(item => {
    const itemDate = new Date(item._id);
    const timeDiff = todayStart - itemDate;
    const diffDays = timeDiff / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays < timeRange;
  }) || [];

  // Map backend data to charts
  const weeklyData = filteredConsultations.map(item => ({
    day: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  const riskDistribution = data?.riskDistribution?.map(item => {
    let color = '#10b981'; // Default GREEN
    if (item._id === 'YELLOW') color = '#f59e0b';
    if (item._id === 'RED') color = '#ef4444';
    return { name: item._id, value: item.count, color };
  }) || [];

  const totalConsultationsInPeriod = filteredConsultations.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const estimatedRevenueInPeriod = totalConsultationsInPeriod * (data?.consultationFee || 800);

  const handleExportCSV = () => {
    try {
      let csvContent = "MediVoice AI - Clinical Analytics Report\n";
      csvContent += `Generated At,${new Date().toLocaleString()}\n`;
      csvContent += `Doctor Name,Dr. ${user?.firstName || 'nag'} ${user?.lastName || 'manthri'}\n`;
      csvContent += `Time Range,Last ${timeRange} Days\n\n`;
      
      csvContent += "SUMMARY METRICS\n";
      csvContent += "Metric,Value\n";
      csvContent += `Total Consultations in Period,${totalConsultationsInPeriod}\n`;
      csvContent += `Estimated Revenue in Period,$${estimatedRevenueInPeriod}\n`;
      csvContent += `Average Rating,${data?.averageRating || '0.0'}\n\n`;
      
      csvContent += "DAILY CONSULTATION BREAKDOWN\n";
      csvContent += "Date,Consultations Count\n";
      filteredConsultations.forEach(item => {
        csvContent += `${item._id},${item.count}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `medivoice_analytics_${timeRange}days.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Clinical report exported successfully as CSV!", {
        icon: '📊',
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Clinical Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your practice performance and patient health trends.</p>
        </div>
        <div className="flex gap-3 relative z-[60]">
          {/* Filter Range dropdown trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsRangeDropdownOpen(!isRangeDropdownOpen)}
              className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
            >
              <Filter className="h-4 w-4" /> Range: Last {timeRange} Days
            </button>
            
            {isRangeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-[70] animate-fade-in">
                {[7, 15, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      setTimeRange(days);
                      setIsRangeDropdownOpen(false);
                      toast.success(`Filtered dashboard to last ${days} days`);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-none ${
                      timeRange === days 
                        ? 'text-doctor dark:text-indigo-400 bg-doctor/5 dark:bg-white/5' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Last {days} Days
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Trigger */}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-doctor text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-200 dark:shadow-[0_0_15px_rgba(99,102,241,0.35)]"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <p className="text-gray-400 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Total Consultations</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{totalConsultationsInPeriod}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> Last {timeRange} Days
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-indigo-950/40 p-3 rounded-2xl text-blue-600 dark:text-indigo-300">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <p className="text-gray-400 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Total Revenue</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">${estimatedRevenueInPeriod}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> Earnings in Period
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-amber-950/40 p-3 rounded-2xl text-orange-600 dark:text-amber-300">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <p className="text-gray-400 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Avg. Rating</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{data?.averageRating?.toFixed(1) || '0.0'}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> Based on Feedback
              </p>
            </div>
            <div className="bg-green-50 dark:bg-emerald-950/40 p-3 rounded-2xl text-green-600 dark:text-emerald-300">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-gray-900 dark:text-white mb-8">Consultation Volume (Last {timeRange} Days)</h3>
          <div className="h-80 w-full">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="opacity-10" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic text-sm">No volume data in this range</div>
            )}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-gray-900 dark:text-white mb-8">Patient Risk Distribution</h3>
          <div className="flex items-center h-80">
            <div className="flex-1 h-full">
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">No data available</div>
              )}
            </div>
            <div className="w-40 space-y-4 pr-4">
              {riskDistribution.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{entry.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalytics;
