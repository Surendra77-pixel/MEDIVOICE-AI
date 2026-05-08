import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // Mock data for UI demonstration based on Stitch design
  const mockDoctors = [
    {
      _id: '1',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Cardiology',
      rating: 4.9,
      experience: 12,
      languages: ['English', 'Spanish'],
      nextAvailable: 'Today at 2:00 PM',
      fastest: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9XFPxcfx4lRzYVhcmFKrlet-iJ4xrUY52T0RpA5aNErOcDrLdUfGy7K2ZARePw6qjvbMxR_3PZ7hCskiLUP-4jMnLRXaV_SYGOaFOq5Kpn1jN01sDdY_jiT6VPj-qKBVFszqOjmuWs1zekE8XMNLDHVL0lWXSNK7ykGGdwMhbLHN8qgNb6Z9aEdJntBMReqBzQpDsu0dcq2uzkcGM41b6ypgHMVOM3b7dDS_u6c2BuqSdWXQ4ak5FrUILzQo58hjaVRXNkw5STq4'
    },
    {
      _id: '2',
      name: 'Dr. James Chen',
      specialty: 'Neurology',
      rating: 5.0,
      experience: 18,
      languages: ['English', 'Mandarin'],
      nextAvailable: 'Tomorrow at 9:30 AM',
      aiRecommended: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXTH3hqCd5ZD6BB1YXKHJJDrRG42VtyhKiotkKJTXkHKfZjDJyxZorBHetTN2xSX02SSNJMkuMxuDJEL6-DnLI4Vzg_H9D7om-dsM0QCC_xDOnBlcqPIhsoLgzlJoI3aRTlmGKNfY_P8frYu45d3yQhl43KKrQFq-TawIvxGaizpX6eHZwQiDQyz68i9dSdCy8JGdii-tXO3AkvfL21BjhLcSKo4XbzbwMwKZ8CEwBe9f4Z4E_xBNzke79MQMZ5mW4m4DfF0b0XWo'
    },
    {
      _id: '3',
      name: 'Dr. David Miller',
      specialty: 'Orthopedics',
      rating: 4.7,
      experience: 9,
      languages: ['English'],
      nextAvailable: 'Wed, Oct 25',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjTCvYi3dYCvYlOZAWs8-flQDYr25FJ-LdXLIZjng0UniwoDKuvf2ZYh3FHQGWiXWODHKRrfKf4l_2--UG72n_YTen5QvnToTXA_m8HLFIzmWY2iPoi82P0TL59VkVOUFs0jaHGEJ-ktkGDipGW-nqiNn3G-dgnzceordupbq4BbNCmTkO_4a9tk5DIGus1R0Xch8kpJ8K3Y5j-BuzCpq59Oq5jwIgOzeYneaHJNE2XcpciFOk4NMD2chzHxKOJtIrP1X4SbytkrM'
    },
    {
      _id: '4',
      name: 'Dr. Elena Rodriguez',
      specialty: 'Pediatrics',
      rating: 4.8,
      experience: 15,
      languages: ['English', 'Portuguese'],
      nextAvailable: 'Today at 4:30 PM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCetcBpgPeqhD9O7tIpLQtBFBLnZdRcT4Xdsw7vjQXBTWBKJm79LmZGAdBQTN3SmW3tpznrcfQfkgiqAvMA36TYo7-7ClfetfNbBd2gJLlwIC9f9VJn6_LYYhJNqrE5Oqg7_TGqExddeR-mZSldFfU5cf4e37xfxshNJw1rEgKdzxs9vrVzCkFcrmgotS4hsXV23D7xnZjutnpTaABiWZQLFdGCKa9A801qc7Ioj-C23OoNW0rRfFGJ_jqPkHYcYCoLC8qDTcj06zc'
    }
  ];

  useEffect(() => {
    // In a real app, fetch from API. Using mock data for UI completeness.
    setDoctors(mockDoctors);
  }, []);

  return (
    <div className="flex flex-col -mt-6 -mx-8">
      {/* Hero Search Section */}
      <section className="py-xl px-md bg-gradient-to-b from-primary/10 to-transparent mb-lg">
        <div className="max-w-7xl mx-auto text-center space-y-md">
          <h1 className="font-h text-5xl text-on-surface">Connect with Precision Care</h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto">Find the right specialist using our AI-driven matching system. Clinical excellence at your fingertips.</p>
          <div className="max-w-4xl mx-auto mt-lg glass-card p-2 rounded-xl shadow-xl shadow-primary/10 flex flex-col md:flex-row gap-2 bg-white/80">
            <div className="flex-1 flex items-center px-md border-b md:border-b-0 md:border-r border-outline-variant/30 py-2">
              <span className="material-symbols-outlined text-primary mr-sm">medical_services</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 font-body outline-none" 
                placeholder="Specialty or Name" 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-md py-2">
              <span className="material-symbols-outlined text-primary mr-sm">location_on</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 font-body outline-none" 
                placeholder="City or Zip" 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="bg-primary text-white px-lg py-md md:py-sm rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 duration-150 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">search</span>
              SEARCH DOCTORS
            </button>
          </div>
        </div>
      </section>

      {/* Listing Section */}
      <section className="max-w-7xl mx-auto px-md pb-xl grid grid-cols-1 md:grid-cols-12 gap-lg w-full">
        {/* Filter Sidebar */}
        <aside className="col-span-12 md:col-span-3 space-y-lg">
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Availability</h3>
            <div className="space-y-sm">
              {['Today', 'Next 48 Hours', 'Weekends'].map(label => (
                <label key={label} className="flex items-center gap-sm cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary/20 border-outline-variant" type="checkbox" />
                  <span className="font-body text-sm text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Provider Gender</h3>
            <div className="flex flex-wrap gap-sm">
              <button className="px-4 py-1 rounded-full border border-outline-variant text-sm hover:border-primary hover:text-primary transition-all">Any</button>
              <button className="px-4 py-1 rounded-full border border-primary bg-primary/5 text-primary text-sm font-bold">Female</button>
              <button className="px-4 py-1 rounded-full border border-outline-variant text-sm hover:border-primary hover:text-primary transition-all">Male</button>
            </div>
          </div>
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Languages</h3>
            <div className="space-y-sm">
              {[
                { lang: 'English', count: 142 },
                { lang: 'Spanish', count: 28 },
                { lang: 'Mandarin', count: 12 }
              ].map(item => (
                <label key={item.lang} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <input className="rounded text-primary focus:ring-primary/20 border-outline-variant" type="checkbox" />
                    <span className="font-body text-sm text-on-surface-variant group-hover:text-primary transition-colors">{item.lang}</span>
                  </div>
                  <span className="font-bold text-xs text-outline-variant">({item.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Insight Sidebar Promo */}
          <div className="p-md rounded-xl bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20 space-y-sm">
            <div className="flex items-center gap-sm text-secondary">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="font-bold text-xs uppercase tracking-wider">AI ASSISTANT</span>
            </div>
            <p className="text-sm text-on-surface-variant">Describe your symptoms to get a tailored list of specialists most suited to your condition.</p>
            <button className="w-full py-2 mt-2 rounded-lg border border-secondary text-secondary font-bold text-xs hover:bg-secondary hover:text-white transition-all uppercase tracking-wider">START SYMPTOM CHECK</button>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="col-span-12 md:col-span-9">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-4">
            <p className="text-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">{doctors.length}</span> doctors</p>
            <div className="flex items-center gap-sm">
              <span className="font-bold text-[10px] text-outline-variant uppercase tracking-wider">SORT BY:</span>
              <select className="bg-transparent border border-outline-variant/30 rounded-lg py-1 px-2 text-sm text-primary focus:ring-0 cursor-pointer outline-none font-bold">
                <option>Highest Rating</option>
                <option>Experience</option>
                <option>Earliest Available</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {doctors.map((doc, idx) => (
              <div key={idx} className={`glass-card bg-white rounded-2xl p-md flex flex-col hover:shadow-lg transition-shadow border group relative overflow-hidden ${doc.aiRecommended ? 'border-secondary shadow-secondary/10' : 'border-outline-variant/30'}`}>
                {doc.aiRecommended && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-secondary text-white font-bold text-[10px] uppercase tracking-widest rounded-bl-lg">
                    AI Recommended
                  </div>
                )}
                
                <div className="flex gap-md mb-md mt-2">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-surface-container">
                      <img className="w-full h-full object-cover" alt={doc.name} src={doc.image} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-1">
                      <h2 className="font-h text-xl text-on-surface group-hover:text-primary transition-colors leading-tight">{doc.name}</h2>
                      <p className="text-primary text-sm font-bold">{doc.specialty}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-xs bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-primary text-[14px]">star</span>
                      <span className="font-bold text-xs text-primary">{doc.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-md flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant text-sm font-medium">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] opacity-70">work</span> {doc.experience} years</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] opacity-70">chat</span> {doc.languages.join(', ')}</span>
                </div>
                
                <div className={`p-sm rounded-xl border mb-md flex items-center justify-between ${doc.aiRecommended ? 'bg-secondary/5 border-secondary/20' : 'bg-surface border-outline-variant/20'}`}>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary text-sm">event_available</span>
                    <span className="text-xs text-on-surface-variant">Next Available: <span className="text-on-surface font-bold">{doc.nextAvailable}</span></span>
                  </div>
                  {doc.fastest && (
                    <span className="bg-secondary/10 text-secondary font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider">Fastest</span>
                  )}
                </div>

                {doc.aiRecommended && (
                  <div className="mb-md flex items-end gap-1 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="bg-secondary w-1.5 h-2 rounded-full"></div>
                    <div className="bg-secondary w-1.5 h-4 rounded-full"></div>
                    <div className="bg-secondary w-1.5 h-3 rounded-full"></div>
                    <div className="bg-secondary w-1.5 h-6 rounded-full"></div>
                    <div className="bg-secondary w-1.5 h-5 rounded-full"></div>
                    <div className="bg-secondary w-1.5 h-8 rounded-full"></div>
                    <span className="ml-2 font-bold text-[9px] text-on-surface-variant uppercase tracking-widest">Patient Success Trend</span>
                  </div>
                )}
                
                <div className="mt-auto flex gap-sm">
                  <button className="flex-1 py-2.5 rounded-xl border-2 border-primary/20 text-primary font-bold text-xs hover:bg-primary/5 transition-all uppercase tracking-wider">VIEW PROFILE</button>
                  <button onClick={() => navigate('/patient/book')} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all uppercase tracking-wider">BOOK NOW</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-xl flex justify-center items-center gap-md">
            <button className="p-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs shadow-md">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container font-bold text-xs text-on-surface-variant transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container font-bold text-xs text-on-surface-variant transition-colors">3</button>
              <span className="font-bold text-on-surface-variant mx-1">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container font-bold text-xs text-on-surface-variant transition-colors">12</button>
            </div>
            <button className="p-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindDoctor;
