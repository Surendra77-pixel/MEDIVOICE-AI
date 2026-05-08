import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-gutter bg-surface/80 backdrop-blur-xl border-b border-outline-variant shadow-sm shadow-primary/5">
        <div className="flex items-center gap-sm">
          <span className="text-2xl font-h font-bold text-primary tracking-tight">MediVoice AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-lg">
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-200" to="/">Home</Link>
          <a className="text-on-surface-variant hover:text-primary transition-all duration-200" href="#features">Features</a>
          <a className="text-on-surface-variant hover:text-primary transition-all duration-200" href="#about">About</a>
          <Link className="text-on-surface-variant hover:text-primary transition-all duration-200" to={ROUTES.PUBLIC.LOGIN}>Login</Link>
        </nav>
        <Link 
          to={ROUTES.PUBLIC.REGISTER}
          className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all text-xs"
        >
          Get Started
        </Link>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-gutter py-xl md:py-[120px] max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-lg items-center">
            <div className="z-10 animate-fade-in">
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-secondary/10 rounded-full mb-md">
                <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">HIPAA COMPLIANT AI</span>
              </div>
              <h1 className="font-h text-5xl md:text-6xl text-primary mb-md leading-tight">
                Breaking Language <br className="hidden md:block"/> Barriers in Healthcare
              </h1>
              <p className="text-lg text-on-surface-variant mb-lg max-w-[540px]">
                Empower your clinical practice with AI-powered real-time translation. Ensure every patient is understood with medical-grade accuracy and automated documentation in 40+ languages.
              </p>
              <div className="flex flex-col sm:flex-row gap-md">
                <button 
                  onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
                  className="bg-primary text-white px-lg py-md rounded-lg font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Try Demo
                </button>
                <button className="border border-primary text-primary px-lg py-md rounded-lg font-bold text-lg hover:bg-primary/5 transition-all">
                  Watch Video
                </button>
              </div>
            </div>
            <div className="relative lg:h-[600px] flex items-center justify-center animate-slide-up">
              {/* Glassmorphic UI Mockup */}
              <div className="glass-card rounded-xl p-md w-full relative z-20 overflow-hidden border-outline-variant/30">
                <img 
                  alt="Clinical environment" 
                  className="rounded-lg w-full h-[400px] object-cover mb-md" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxBN1j3KBgdkIBFIt4fBM1a6JHL0tIPtz68RRQfb79qE5aZooYpnSbqhrE7iWxEHbfHkN_69oFTlFVbJhEJ2FobpTOFlvTWhvdyXwmlQcu3bYa1qukcuuHTi5YQWHjNikb7q1C-cUbsNPk4MM3oKeIcxsCXD94n7nb8IUAgY40ZkaFdqQSg8fro-FRVgyqhhzm7gDX5j71zvdBlDehQpp3p9pJczJbjooqO6CRDPOGu61zC7o-wZoZabJV5QE3PdwB4KpXk6RVMEk"
                />
                <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">translate</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase">LIVE TRANSLATION</p>
                      <p className="text-sm text-on-surface">English → Spanish (Medical context)</p>
                    </div>
                  </div>
                  <div className="flex gap-xs">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-secondary opacity-50"></div>
                  </div>
                </div>
              </div>
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-surface-container-lowest px-gutter py-xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-lg">
              <h2 className="font-h text-4xl text-primary mb-sm">Precision Features for Professionals</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                We combine state-of-the-art Large Language Models with specific medical training to deliver unmatched clinical utility.
              </p>
            </div>
            {/* Bento-style Grid */}
            <div className="grid md:grid-cols-3 gap-md">
              {/* Feature 1 */}
              <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-md group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-white">record_voice_over</span>
                </div>
                <h3 className="font-h text-2xl text-on-surface mb-sm">Real-time Translation</h3>
                <p className="text-on-surface-variant">
                  Instant voice-to-voice translation optimized for high-pressure clinical environments. Our AI handles specialized medical terminology with 99.4% precision.
                </p>
                <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center gap-xs">
                  <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4"></div>
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase">FAST</span>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-md group-hover:bg-secondary transition-colors">
                  <span className="material-symbols-outlined text-[32px] text-secondary group-hover:text-white">description</span>
                </div>
                <h3 className="font-h text-2xl text-on-surface mb-sm">AI SOAP Notes</h3>
                <p className="text-on-surface-variant">
                  Automatically generate comprehensive clinical documentation from translated patient encounters. Integrated directly with your existing EHR system.
                </p>
                <div className="mt-md pt-md border-t border-outline-variant/30">
                  <div className="flex flex-wrap gap-xs">
                    <span className="px-sm py-xs bg-surface-container rounded-full text-[10px] font-bold text-on-surface-variant uppercase">AUTO-FILLED</span>
                    <span className="px-sm py-xs bg-surface-container rounded-full text-[10px] font-bold text-on-surface-variant uppercase">EHR SYNC</span>
                  </div>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-lg bg-tertiary/10 flex items-center justify-center mb-md group-hover:bg-tertiary transition-colors">
                  <span className="material-symbols-outlined text-[32px] text-tertiary group-hover:text-white">health_and_safety</span>
                </div>
                <h3 className="font-h text-2xl text-on-surface mb-sm">Medical History Vault</h3>
                <p className="text-on-surface-variant">
                  Secure, encrypted storage for every translated transcript. Access historical patient data and longitudinal health trends in seconds.
                </p>
                <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="material-symbols-outlined text-secondary">shield_lock</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">AES-256 ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="px-gutter py-xl max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-xl flex flex-col md:flex-row items-center gap-lg">
            <div className="md:w-1/2">
              <h2 className="font-h text-4xl text-primary mb-md">Trusted by Leading Institutions</h2>
              <p className="text-lg text-on-surface-variant mb-lg">
                "MediVoice AI has reduced our patient consultation time by 30% while significantly increasing patient satisfaction scores among our non-English speaking population."
              </p>
              <div className="flex items-center gap-sm">
                <div className="w-12 h-12 rounded-full bg-outline-variant overflow-hidden">
                  <img 
                    alt="Dr. Sarah Chen" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB3HTb_AhRDlYUTE1PrNa0f0u-eb5tTdTW_xVnFevTs1O50jYld00p5teeOTPwV2fEHDYbm71vQKfif0qv3WlO_i0ql9oBnwSyG0DkXXIZFyEkAba4e_Z0FwVLZpSzk3PrLe16V6w2t-hPUmvYHK2quX-7jyn6qi4N0-pfQW-tCi1wmw1N3nMCU2oBTTbhv3OUnO9-F6d2cao8UtXuPuQUYc2UJ4s7u1Uj7obbIr4T5ciyJSa3og8ZsrTSU4MTuN4FUExK4_9sBlQ"
                  />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Dr. Sarah Chen</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Director of Innovation, Metro Health</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-md">
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/20">
                <p className="text-4xl font-h text-primary">40+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">LANGUAGES</p>
              </div>
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/20">
                <p className="text-4xl font-h text-secondary">99.4%</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">ACCURACY</p>
              </div>
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/20">
                <p className="text-4xl font-h text-tertiary">2M+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">TRANSCRIPTS</p>
              </div>
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/20">
                <p className="text-4xl font-h text-on-surface">HIPAA</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">COMPLIANT</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-gutter py-xl bg-primary-container text-white">
          <div className="max-w-7xl mx-auto text-center py-lg">
            <h2 className="font-h text-5xl mb-md">Ready to Transform Your Practice?</h2>
            <p className="text-xl mb-lg max-w-2xl mx-auto opacity-90">
              Join 5,000+ healthcare providers who are delivering better care through AI-powered communication.
            </p>
            <div className="flex justify-center gap-md">
              <button 
                onClick={() => navigate(ROUTES.PUBLIC.REGISTER)}
                className="bg-white text-primary px-lg py-md rounded-lg font-bold text-lg shadow-lg hover:bg-surface-container-lowest transition-all"
              >
                Schedule a Demo
              </button>
              <button className="border border-white text-white px-lg py-md rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-lg px-gutter flex flex-col md:flex-row justify-between items-center gap-md max-w-7xl mx-auto bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="text-2xl font-h font-bold text-primary">MediVoice AI</span>
          <p className="text-sm text-on-surface-variant">© 2024 MediVoice AI. Clinical-grade transcription for modern healthcare.</p>
        </div>
        <div className="flex gap-md">
          <a className="text-on-surface-variant text-[10px] font-bold uppercase hover:text-primary underline transition-all" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant text-[10px] font-bold uppercase hover:text-primary underline transition-all" href="#">Terms of Service</a>
          <a className="text-on-surface-variant text-[10px] font-bold uppercase hover:text-primary underline transition-all" href="#">Security</a>
          <a className="text-on-surface-variant text-[10px] font-bold uppercase hover:text-primary underline transition-all" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
