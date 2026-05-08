import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const HospitalFinder = () => {
  const [search, setSearch] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const fetchHospitals = async (query = '') => {
    setLoading(true);
    try {
      // For now, using mock data that follows the Stitch design since we don't have a real geolocation API hooked up
      const mockHospitals = [
        {
          id: 1,
          name: "St. Jude's Medical Center",
          distance: "1.2 miles",
          status: "Open 24/7",
          statusColor: "green",
          emergency: true,
          waitTime: "< 15 mins",
          type: "Hospital"
        },
        {
          id: 2,
          name: "City General Health Plaza",
          distance: "2.8 miles",
          status: "Busy",
          statusColor: "amber",
          emergency: true,
          waitTime: "~ 45 mins",
          type: "Clinic"
        },
        {
          id: 3,
          name: "Northside Pediatric Clinic",
          distance: "3.5 miles",
          status: "Open 24/7",
          statusColor: "green",
          emergency: false,
          waitTime: "Virtual Check-in",
          type: "Clinic"
        }
      ];
      setHospitals(mockHospitals);
    } catch (error) {
      toast.error('Failed to find hospitals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] -mt-6 -mx-8 overflow-hidden bg-white">
      {/* List Section (40%) */}
      <section className="w-full md:w-[40%] flex flex-col h-full border-r border-outline-variant/30">
        <div className="p-md bg-surface-bright flex flex-col gap-sm shadow-sm z-10 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <h2 className="font-h text-2xl text-on-surface">Hospital Finder</h2>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {hospitals.length} Nearby
            </span>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">location_on</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/60 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none" 
              placeholder="Search by City, Pincode or Name..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {['All', 'Emergency', 'Cardiology', '24/7 Open'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-wider ${
                  filter === f ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Cards Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          ) : (
            hospitals.map(hospital => (
              <div 
                key={hospital.id}
                className="bg-white border border-outline-variant/40 rounded-2xl p-md shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary/30"
              >
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex flex-col">
                    <h3 className="font-h text-lg text-on-surface group-hover:text-primary transition-colors">{hospital.name}</h3>
                    <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1 font-bold">
                      <span className="material-symbols-outlined text-sm">near_me</span>
                      <span>{hospital.distance} away</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${
                    hospital.statusColor === 'green' ? 'bg-secondary/10 text-secondary' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {hospital.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 mb-md">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                    <span>{hospital.emergency ? 'Emergency Room Available' : 'Consultation Only'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-sm text-secondary">timer</span>
                    <span>Wait time: {hospital.waitTime}</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-lg">directions</span>
                  Get Directions
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Map Section (60%) */}
      <section className="hidden md:flex flex-1 relative bg-surface-container overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply" 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600"
            alt="Map Background"
          />
        </div>
        
        {/* Map UI Overlays */}
        <div className="absolute inset-0 p-md pointer-events-none">
          {/* Active Marker */}
          <div className="absolute top-[35%] left-[45%] pointer-events-auto cursor-pointer animate-bounce-slow">
            <div className="relative group">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-white p-3 rounded-xl shadow-2xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-bold text-xs text-on-surface">St. Jude's Medical Center</p>
                <p className="text-[10px] text-on-surface-variant">Primary Emergency Hub</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg fill-current">medical_services</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-md right-md flex flex-col gap-3 pointer-events-auto">
            <div className="flex flex-col bg-white rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden">
              <button className="p-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/20">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="p-3 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
            <button className="p-3 bg-white rounded-xl shadow-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-md right-md pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white shadow-xl flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Emergency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Clinic</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HospitalFinder;
