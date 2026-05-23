import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-hot-toast';

const Landing = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-gray-950 text-white font-body min-h-screen relative overflow-x-hidden">
      {/* Fixed Deep dark gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 z-0"></div>
      
      {/* Fixed Animated GIF Background */}
      <div 
        className="fixed inset-0 opacity-20 mix-blend-screen pointer-events-none z-0"
        style={{ backgroundImage: 'url(https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGo5ZmllM3M5MjVhN3I0dzRvbXJidGV4MDM1ZDF4d2s5bTBnZnQ2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3nWgXCpQpMUOrkoo/giphy.gif)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-gutter bg-gray-950/40 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-sm">
          <motion.span 
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="text-2xl font-h font-bold tracking-tight drop-shadow-md bg-gradient-to-r from-white via-indigo-300 to-white text-transparent bg-clip-text"
            style={{ backgroundSize: '200% auto' }}
          >
            MediVoice AI
          </motion.span>
        </div>
        <nav className="hidden md:flex items-center gap-lg">
          <Link className="text-white font-bold border-b-2 border-primary pb-1 transition-all duration-200" to="/">Home</Link>
          <a className="text-gray-400 hover:text-white transition-all duration-200" href="#features">Features</a>
          <a className="text-gray-400 hover:text-white transition-all duration-200" href="#about">About</a>
          <Link className="text-gray-400 hover:text-white transition-all duration-200" to={ROUTES.PUBLIC.LOGIN}>Login</Link>
        </nav>
        <Link 
          to={ROUTES.PUBLIC.REGISTER}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all text-xs border border-white/10"
        >
          Get Started
        </Link>
      </header>

      <main className="pt-20">
        {/* Professional 3D Premium Hero Section */}
        <section className="relative px-gutter py-xl md:py-[120px] min-h-[90vh] flex items-center text-white z-10">
          {/* Glowing Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] pointer-events-none z-0"
          ></motion.div>
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[150px] pointer-events-none z-0"
          ></motion.div>

          <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-xl items-center">
            {/* Text Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/10 shadow-xl shadow-black/20 relative z-10">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">HIPAA Compliant AI System</span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="font-h text-5xl md:text-7xl font-bold mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 relative z-10">
                The Future of <br className="hidden md:block"/> Clinical Practice
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 mb-10 max-w-[540px] leading-relaxed relative z-10">
                Empower your practice with next-generation AI. Real-time medical translation and automated documentation in a stunning, secure environment.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Experience the Future</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-4 rounded-xl font-bold text-lg text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-indigo-300 group-hover:text-white transition-colors">play_circle</span>
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>

            {/* 3D Visual Asset */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              {/* Main Floating 3D Hologram */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 bottom-0 h-1/3 mt-auto rounded-2xl"></div>
                <img 
                  src="/images/3d-hero.png" 
                  alt="3D Medical AI Hologram" 
                  className="w-full h-auto rounded-3xl shadow-2xl shadow-black/50 border border-white/10 object-cover transform-gpu"
                />
              </motion.div>

              {/* Floating UI Elements (Glassmorphism) */}
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 md:-left-16 z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl shadow-black/40 w-64"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                    <span className="material-symbols-outlined text-secondary text-xl">translate</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Live AI Translation</p>
                    <p className="text-sm font-medium text-white">English → Hindi</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -top-8 -right-8 md:-right-12 z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl shadow-black/40"
              >
                 <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-4 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Processing Speech...</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="text-white px-gutter py-xl md:py-32 relative z-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="font-h text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
                Precision Features for Professionals
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We combine state-of-the-art Large Language Models with specific medical training to deliver unmatched clinical utility.
              </p>
            </motion.div>
            
            {/* 3D Bento-style Grid */}
            <div className="grid md:grid-cols-3 gap-8 perspective-1000">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, rotateX: 20, y: 30 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 border border-primary/30 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <span className="material-symbols-outlined text-[32px] text-indigo-300 group-hover:text-white transition-colors">record_voice_over</span>
                </div>
                <h3 className="font-h text-2xl font-bold mb-4 text-white">Real-time Translation</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Instant voice-to-voice translation optimized for high-pressure clinical environments. Our AI handles specialized medical terminology with 99.4% precision.
                </p>
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-indigo-300 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                    ></motion.div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">FAST</span>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, rotateX: 20, y: 30 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8 border border-secondary/30 group-hover:bg-secondary transition-colors duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <span className="material-symbols-outlined text-[32px] text-green-400 group-hover:text-white transition-colors">description</span>
                </div>
                <h3 className="font-h text-2xl font-bold mb-4 text-white">AI SOAP Notes</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Automatically generate comprehensive clinical documentation from translated patient encounters. Integrated directly with your existing EHR system.
                </p>
                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-white/5">AUTO-FILLED</span>
                    <span className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-white/5">EHR SYNC</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0, rotateX: 20, y: 30 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(234,179,8,0.15)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-tertiary/20 flex items-center justify-center mb-8 border border-tertiary/30 group-hover:bg-tertiary transition-colors duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  <span className="material-symbols-outlined text-[32px] text-yellow-400 group-hover:text-white transition-colors">health_and_safety</span>
                </div>
                <h3 className="font-h text-2xl font-bold mb-4 text-white">Medical History Vault</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Secure, encrypted storage for every translated transcript. Access historical patient data and longitudinal health trends in seconds.
                </p>
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="material-symbols-outlined text-yellow-400">shield_lock</span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">AES-256 ENCRYPTED</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="px-gutter py-xl md:py-32 text-white relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-16 border border-white/10 flex flex-col lg:flex-row items-center gap-16 shadow-2xl relative overflow-hidden"
            >
              {/* Background gradient blob for proof section */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

              <div className="lg:w-1/2 relative z-10">
                <h2 className="font-h text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Trusted by Leading Institutions</h2>
                <div className="relative">
                  <span className="absolute -left-6 -top-4 text-6xl text-primary/30 font-serif">"</span>
                  <p className="text-xl text-gray-300 mb-10 leading-relaxed relative z-10">
                    MediVoice AI has reduced our patient consultation time by 30% while significantly increasing patient satisfaction scores among our non-English speaking population.
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-primary/50 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <img 
                      alt="Dr. Sarah Chen" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB3HTb_AhRDlYUTE1PrNa0f0u-eb5tTdTW_xVnFevTs1O50jYld00p5teeOTPwV2fEHDYbm71vQKfif0qv3WlO_i0ql9oBnwSyG0DkXXIZFyEkAba4e_Z0FwVLZpSzk3PrLe16V6w2t-hPUmvYHK2quX-7jyn6qi4N0-pfQW-tCi1wmw1N3nMCU2oBTTbhv3OUnO9-F6d2cao8UtXuPuQUYc2UJ4s7u1Uj7obbIr4T5ciyJSa3og8ZsrTSU4MTuN4FUExK4_9sBlQ"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Dr. Sarah Chen</p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Director of Innovation, Metro Health</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10 w-full">
                <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10 shadow-inner">
                  <p className="text-5xl font-h font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-600 mb-2">Regional</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LANGUAGES</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10 shadow-inner">
                  <p className="text-5xl font-h font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600 mb-2">99.4%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ACCURACY</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10 shadow-inner">
                  <p className="text-5xl font-h font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 mb-2">2M+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TRANSCRIPTS</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/10 shadow-inner">
                  <p className="text-5xl font-h font-bold text-white mb-2">HIPAA</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">COMPLIANT</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D CTA Section */}
        <section className="relative px-gutter py-[120px] text-white z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-[100px] pointer-events-none opacity-50"
          ></motion.div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-16 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
              
              <h2 className="font-h text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white relative z-10">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-xl mb-12 text-gray-300 relative z-10 leading-relaxed max-w-2xl mx-auto">
                Join 5,000+ healthcare providers who are delivering better care through AI-powered communication.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <button 
                  onClick={() => navigate(ROUTES.PUBLIC.REGISTER)}
                  className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  Schedule a Demo
                </button>
                <button 
                  onClick={() => toast('Pricing plans will be available soon! Please schedule a demo.', { icon: '💡' })}
                  className="border border-white/30 bg-black/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  View Pricing
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-gutter flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <motion.span 
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="text-2xl font-h font-bold bg-gradient-to-r from-white via-indigo-300 to-white text-transparent bg-clip-text"
              style={{ backgroundSize: '200% auto' }}
            >
              MediVoice AI
            </motion.span>
            <p className="text-sm">built by surendra manthri</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Security</a>
            <a className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
      {/* Video Demo Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 p-2 sm:p-4 rounded-3xl shadow-2xl shadow-indigo-500/20 w-full max-w-5xl relative overflow-hidden"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                {/* Embedded Placeholder Video */}
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                  title="MediVoice AI Demo" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
                
                {/* Fallback Overlay text in case iframe is blocked */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 pointer-events-none">
                  <h3 className="text-white font-bold text-lg mb-1">MediVoice AI Platform Demo</h3>
                  <p className="text-gray-400 text-sm">See how our AI transforms clinical documentation in real-time.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
