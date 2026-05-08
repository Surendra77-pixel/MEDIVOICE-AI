import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldOff, 
  UserMinus, 
  Mail, 
  MapPin, 
  ArrowUpRight,
  UserX,
  UserCheck
} from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('all'); // all | patient | doctor
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        toast.success(`User ${currentStatus ? 'suspended' : 'activated'} successfully`);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeTab !== 'all' && user.role !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = {
    patients: users.filter(u => u.role === 'patient').length,
    doctors: users.filter(u => u.role === 'doctor').length,
    suspended: users.filter(u => !u.isActive).length,
    unverifiedDoctors: users.filter(u => u.role === 'doctor' && !u.isVerified).length,
  };

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">User Directory</h1>
          <p className="text-gray-500 font-medium text-sm">Manage access, status, and activity for all platform participants.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
             Export Data
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white px-8 py-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Patients</p>
            <h4 className="text-2xl font-black text-green-600">{stats.patients}</h4>
          </div>
        </div>
        <div className="bg-white px-8 py-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Doctors</p>
            <h4 className="text-2xl font-black text-blue-600">{stats.doctors}</h4>
          </div>
        </div>
        <div className="bg-white px-8 py-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suspended Accounts</p>
            <h4 className="text-2xl font-black text-red-600">{stats.suspended}</h4>
          </div>
        </div>
        <div className="bg-white px-8 py-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Verification</p>
            <h4 className="text-2xl font-black text-orange-600">{stats.unverifiedDoctors}</h4>
          </div>
        </div>
      </div>

      {/* Table & Filters */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col xl:flex-row gap-8 justify-between items-center">
          <div className="flex bg-gray-50 p-2 rounded-2xl w-full xl:w-auto">
            {['all', 'patient', 'doctor'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 xl:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-admin shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex flex-1 max-w-2xl gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-admin outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center text-gray-500 font-medium">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-admin group-hover:text-white transition-all duration-300">
                          {user.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className={`text-xs font-black uppercase tracking-wider mb-1 ${user.role === 'doctor' ? 'text-blue-600' : 'text-green-600'}`}>
                        {user.role}
                      </p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                        !user.isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {!user.isActive ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`p-3 rounded-xl transition-all ${user.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-red-500 bg-red-50 hover:bg-red-100'}`} 
                          title={user.isActive ? "Suspend Account" : "Activate Account"}
                        >
                          {user.isActive ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
