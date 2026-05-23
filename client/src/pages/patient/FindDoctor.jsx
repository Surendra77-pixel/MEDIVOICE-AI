import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../../components/common/CustomSelect';

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search & Filter States
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState([]);
  const [gender, setGender] = useState('Any');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('Highest Rating');
  const navigate = useNavigate();

  // Mock data for UI demonstration based on Stitch design
  const mockDoctors = [
    {
      _id: '1',
      name: 'Dr. Sarah Mitchell',
      gender: 'Female',
      specialty: 'Cardiology',
      rating: 4.9,
      experience: 12,
      languages: ['Hindi', 'Tamil'],
      nextAvailable: 'Today at 2:00 PM',
      fastest: true,
      image: '/images/doctor_female_1.png'
    },
    {
      _id: '2',
      name: 'Dr. James Chen',
      gender: 'Male',
      specialty: 'Neurology',
      rating: 5.0,
      experience: 18,
      languages: ['Hindi', 'Telugu'],
      nextAvailable: 'Tomorrow at 9:30 AM',
      aiRecommended: true,
      image: '/images/doctor_male_1.png'
    },
    {
      _id: '3',
      name: 'Dr. David Miller',
      gender: 'Male',
      specialty: 'Orthopedics',
      rating: 4.7,
      experience: 9,
      languages: ['Hindi'],
      nextAvailable: 'Wed, Oct 25',
      image: '/images/doctor_male_2.png'
    },
    {
      _id: '4',
      name: 'Dr. Elena Rodriguez',
      gender: 'Female',
      specialty: 'Pediatrics',
      rating: 4.8,
      experience: 15,
      languages: ['Tamil', 'Telugu'],
      nextAvailable: 'Today at 4:30 PM',
      image: '/images/doctor_female_2.png'
    }
  ];

  const [allDoctors, setAllDoctors] = useState([]);

  useEffect(() => {
    // Fetch real doctors from the API to use real IDs for booking
    const fetchRealDoctors = async () => {
      setLoading(true);
      try {
        const response = await api.get('/patient/doctors/search');
        const realDoctors = response.data?.data?.doctors || [];
        
        // Merge real doctors with our UI properties for a premium look
        const augmentedDoctors = realDoctors.map((realDoc, index) => {
          // Cycle through our mock properties based on index
          const mockTemplate = mockDoctors[index % mockDoctors.length];
          return {
            _id: realDoc.userId?._id || realDoc._id,
            name: `Dr. ${realDoc.userId?.firstName} ${realDoc.userId?.lastName}`,
            gender: mockTemplate.gender,
            specialty: realDoc.specialization || realDoc.specialty || mockTemplate.specialty,
            rating: realDoc.rating || mockTemplate.rating,
            experience: realDoc.experience || mockTemplate.experience,
            languages: realDoc.languages?.length ? realDoc.languages : mockTemplate.languages,
            nextAvailable: mockTemplate.nextAvailable,
            fastest: mockTemplate.fastest,
            aiRecommended: mockTemplate.aiRecommended,
            image: (realDoc.profilePic && !realDoc.profilePic.includes('unsplash') && !realDoc.profilePic.includes('googleusercontent') && !realDoc.profilePic.includes('placeholder')) ? realDoc.profilePic : mockTemplate.image,
            // also keep the raw realDoc in case we need it
            raw: realDoc
          };
        });
        
        if (augmentedDoctors.length > 0) {
          setAllDoctors(augmentedDoctors);
          setDoctors(augmentedDoctors);
        } else {
          setAllDoctors(mockDoctors);
          setDoctors(mockDoctors);
        }
      } catch (error) {
        console.error("Failed to fetch real doctors:", error);
        setAllDoctors(mockDoctors);
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealDoctors();
  }, []); 

  useEffect(() => {
    // Apply filters & sorting whenever state changes
    let filtered = [...allDoctors];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
    }

    // Gender filter
    if (gender !== 'Any') {
      filtered = filtered.filter(d => d.gender === gender);
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(d => d.languages.some(l => selectedLanguages.includes(l)));
    }

    // Availability filter
    if (availability.length > 0) {
      filtered = filtered.filter(d => {
        let match = false;
        if (availability.includes('Today') && d.nextAvailable.includes('Today')) match = true;
        if (availability.includes('Next 48 Hours') && (d.nextAvailable.includes('Today') || d.nextAvailable.includes('Tomorrow'))) match = true;
        if (availability.includes('Weekends') && (d.nextAvailable.includes('Sat') || d.nextAvailable.includes('Sun'))) match = true;
        return match;
      });
    }

    // Sorting
    if (sortBy === 'Highest Rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === 'Earliest Available') {
      // Mock earliest by bringing fastest or Today first
      filtered.sort((a, b) => {
        if (a.fastest) return -1;
        if (b.fastest) return 1;
        if (a.nextAvailable.includes('Today') && !b.nextAvailable.includes('Today')) return -1;
        if (!a.nextAvailable.includes('Today') && b.nextAvailable.includes('Today')) return 1;
        return 0;
      });
    }

    setDoctors(filtered);
  }, [search, location, gender, selectedLanguages, availability, sortBy, allDoctors]);

  const toggleAvailability = (label) => {
    setAvailability(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  return (
    <div className="flex flex-col -mt-6 -mx-8">
      {/* Hero Search Section */}
      <section className="py-xl px-md bg-gradient-to-b from-primary/10 to-transparent mb-lg">
        <div className="max-w-7xl mx-auto text-center space-y-md">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-h text-5xl text-on-surface dark:text-white"
          >
            Connect with Precision Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-on-surface-variant dark:text-gray-400 max-w-2xl mx-auto"
          >
            Find the right specialist using our AI-driven matching system. Clinical excellence at your fingertips.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="max-w-4xl mx-auto mt-lg p-2 rounded-2xl shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col md:flex-row gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-outline-variant/30 dark:border-white/10"
          >
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
            <button className="bg-primary text-white px-lg py-md md:py-sm rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all active:scale-95 duration-150 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">search</span>
              SEARCH DOCTORS
            </button>
          </motion.div>
        </div>
      </section>

      {/* Listing Section */}
      <section className="max-w-7xl mx-auto px-md pb-xl grid grid-cols-1 md:grid-cols-12 gap-lg w-full">
        {/* Filter Sidebar */}
        <aside className="col-span-12 md:col-span-3 space-y-lg">
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary dark:text-sky-400 uppercase tracking-widest">Availability</h3>
            <div className="space-y-sm">
              {['Today', 'Next 48 Hours', 'Weekends'].map(label => (
                <label key={label} className="flex items-center gap-sm cursor-pointer group">
                  <input 
                    className="rounded text-primary dark:text-sky-500 focus:ring-primary/20 dark:focus:ring-sky-500/20 border-outline-variant dark:border-white/20 dark:bg-black/30" 
                    type="checkbox"
                    checked={availability.includes(label)}
                    onChange={() => toggleAvailability(label)}
                  />
                  <span className="font-body text-sm text-on-surface-variant dark:text-gray-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary dark:text-sky-400 uppercase tracking-widest">Provider Gender</h3>
            <div className="flex flex-wrap gap-sm">
              {['Any', 'Female', 'Male'].map(gen => (
                <button 
                  key={gen}
                  onClick={() => setGender(gen)}
                  className={`px-4 py-1 rounded-full border text-sm transition-all ${
                    gender === gen 
                      ? 'border-primary bg-primary/5 text-primary font-bold dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-400' 
                      : 'border-outline-variant dark:border-white/10 text-on-surface-variant dark:text-gray-300 hover:border-primary dark:hover:border-sky-400 hover:text-primary dark:hover:text-sky-400'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-md">
            <h3 className="font-bold text-xs text-primary dark:text-sky-400 uppercase tracking-widest">Languages</h3>
            <div className="space-y-sm">
              {[
                { lang: 'Hindi', count: 142 },
                { lang: 'Tamil', count: 56 },
                { lang: 'Telugu', count: 34 }
              ].map(item => (
                <label key={item.lang} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <input 
                      className="rounded text-primary dark:text-sky-500 focus:ring-primary/20 dark:focus:ring-sky-500/20 border-outline-variant dark:border-white/20 dark:bg-black/30" 
                      type="checkbox" 
                      checked={selectedLanguages.includes(item.lang)}
                      onChange={() => toggleLanguage(item.lang)}
                    />
                    <span className="font-body text-sm text-on-surface-variant dark:text-gray-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">{item.lang}</span>
                  </div>
                  <span className="font-bold text-xs text-outline-variant dark:text-gray-400">({item.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Insight Sidebar Promo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-md rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/5 dark:from-secondary/20 dark:to-primary/10 border border-secondary/20 dark:border-secondary/30 space-y-sm shadow-sm"
          >
            <div className="flex items-center gap-sm text-secondary dark:text-sky-400">
              <span className="material-symbols-outlined animate-pulse">auto_awesome</span>
              <span className="font-bold text-xs uppercase tracking-wider">AI ASSISTANT</span>
            </div>
            <p className="text-sm text-on-surface-variant dark:text-gray-300">Describe your symptoms to get a tailored list of specialists most suited to your condition.</p>
            <button 
              onClick={() => navigate('/patient/chatbot')}
              className="w-full py-2 mt-2 rounded-xl border border-secondary text-secondary font-bold text-xs hover:bg-secondary hover:text-white hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] active:scale-95 transition-all uppercase tracking-wider"
            >
              START SYMPTOM CHECK
            </button>
          </motion.div>
        </aside>

        {/* Results Grid */}
        <div className="col-span-12 md:col-span-9">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-4">
            <p className="text-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">{doctors.length}</span> doctors</p>
            <div className="flex items-center gap-sm">
              <span className="font-bold text-[10px] text-outline-variant uppercase tracking-wider">SORT BY:</span>
              <CustomSelect 
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { code: 'Highest Rating', label: 'Highest Rating' },
                  { code: 'Experience', label: 'Experience' },
                  { code: 'Earliest Available', label: 'Earliest Available' }
                ]}
                className="w-48 text-xs font-bold"
              />
            </div>
          </div>

          {doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-xl bg-surface-container/50 rounded-2xl border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">search_off</span>
              <h3 className="text-lg font-h text-on-surface mb-2">No doctors match your filters</h3>
              <p className="text-sm text-on-surface-variant">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSearch(''); setAvailability([]); setGender('Any'); setSelectedLanguages([]); setSortBy('Highest Rating'); }}
                className="mt-4 px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-all text-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-md"
            >
              <AnimatePresence>
                {doctors.map((doc, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
                    }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className={`bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-md flex flex-col transition-all border group relative overflow-hidden shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-lg dark:hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)] ${doc.aiRecommended ? 'border-secondary/40 dark:border-secondary/30 shadow-secondary/10' : 'border-outline-variant/30 dark:border-white/10'}`}
                  >
                    {doc.aiRecommended && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-secondary to-sky-400 text-white font-bold text-[10px] uppercase tracking-widest rounded-bl-xl shadow-sm">
                        AI Recommended
                      </div>
                    )}
                    
                    <div className="flex gap-md mb-md mt-2">
                      <div className="relative shrink-0 group/avatar">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-surface-container dark:bg-white/10 shadow-inner relative border border-outline-variant/30 dark:border-white/10 group-hover/avatar:border-primary/50 dark:group-hover/avatar:border-sky-400/50 transition-all duration-300">
                          <img className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" alt={doc.name} src={doc.image} />
                          
                          {/* Holographic scanning line animation */}
                          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-transparent via-sky-400/30 to-transparent h-6 pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 animate-holo-scan"></div>
                          
                          {/* Tech grid glow effect on hover */}
                          <div className="absolute inset-0 bg-sky-400/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0f172a] shadow-md group-hover/avatar:scale-110 transition-transform duration-300">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col items-start gap-1">
                          <h2 className="font-h text-xl text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-indigo-300 transition-colors leading-tight">{doc.name}</h2>
                          <p className="text-primary dark:text-indigo-300 text-sm font-bold">{doc.specialty}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-xs bg-primary/10 dark:bg-primary/20 w-fit px-2 py-0.5 rounded-full border border-primary/20 dark:border-primary/30">
                          <span className="material-symbols-outlined text-primary dark:text-indigo-300 text-[14px]">star</span>
                          <span className="font-bold text-xs text-primary dark:text-indigo-300">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-md flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant dark:text-gray-400 text-sm font-medium">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] opacity-70">work</span> {doc.experience} years</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] opacity-70">chat</span> {doc.languages.join(', ')}</span>
                    </div>
                    
                    <div className={`p-sm rounded-xl border mb-md flex items-center justify-between ${doc.aiRecommended ? 'bg-secondary/5 dark:bg-secondary/10 border-secondary/20 dark:border-secondary/30' : 'bg-surface dark:bg-white/5 border-outline-variant/20 dark:border-white/10'}`}>
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-secondary dark:text-sky-400 text-sm">event_available</span>
                        <span className="text-xs text-on-surface-variant dark:text-gray-400">Next Available: <span className="text-on-surface dark:text-white font-bold">{doc.nextAvailable}</span></span>
                      </div>
                      {doc.fastest && (
                        <span className="bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-sky-300 font-bold text-[9px] px-2 py-1 rounded uppercase tracking-wider">Fastest</span>
                      )}
                    </div>

                    {doc.aiRecommended && (
                      <div className="mb-md flex items-end gap-1 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-2 rounded-full animate-pulse"></div>
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-3 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-6 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <div className="bg-secondary dark:bg-sky-400 w-1.5 h-8 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span className="ml-2 font-bold text-[9px] text-on-surface-variant dark:text-gray-400 uppercase tracking-widest">Patient Success Trend</span>
                      </div>
                    )}
                    
                    <div className="mt-auto flex gap-sm">
                      <button className="flex-1 py-2.5 rounded-xl border-2 border-primary/20 dark:border-primary/40 text-primary dark:text-indigo-300 font-bold text-xs hover:bg-primary/10 dark:hover:bg-primary/20 transition-all uppercase tracking-wider">VIEW PROFILE</button>
                      <button onClick={() => navigate('/patient/book', { state: { preSelectedDoctor: doc } })} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95 transition-all uppercase tracking-wider">BOOK NOW</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {doctors.length > 0 && (
            <div className="mt-xl flex justify-center items-center gap-md">
              <button className="p-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs shadow-md">1</button>
              </div>
              <button className="p-2 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FindDoctor;
