import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
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
   ArrowDownRight,
   Filter,
   Download
} from 'lucide-react';

const DoctorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  // Map backend data to charts
  const weeklyData = data?.consultationsPerDay?.map(item => ({
    day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    count: item.count
  })) || [];

  const riskDistribution = data?.riskDistribution?.map(item => {
    let color = '#10b981'; // Default green
    if (item._id === 'Medium') color = '#f59e0b';
    if (item._id === 'High') color = '#ef4444';
    if (item._id === 'Critical') color = '#7f1d1d';
    return { name: item._id, value: item.count, color };
  }) || [];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Clinical Analytics</h1>
          <p className="text-gray-500">Track your practice performance and patient health trends.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            <Filter className="h-4 w-4" /> Filter Range
          </button>
          <button className="flex items-center gap-2 bg-doctor text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-doctor-dark transition-colors">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Total Consultations</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900">{data?.consultationsPerDay?.reduce((acc, curr) => acc + curr.count, 0) || 0}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> Last 30 Days
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Total Revenue</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900">${data?.totalRevenue || 0}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> Life-time Earnings
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Avg. Rating</p>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-black text-gray-900">{data?.averageRating?.toFixed(1) || '0.0'}</h3>
              <p className="text-green-500 text-xs font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> Based on Feedback
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8">Consultation Volume (Last 30 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8">Patient Risk Distribution</h3>
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
                <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
              )}
            </div>
            <div className="w-40 space-y-4 pr-4">
              {riskDistribution.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                    <span className="text-xs font-medium text-gray-500">{entry.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{entry.value}</span>
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
