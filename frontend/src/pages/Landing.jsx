import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
      
      {/* Animated Logo */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Shield size={120} color="#38bdf8" strokeWidth={1} />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: '4rem', margin: '1rem 0', fontWeight: '800', background: '-webkit-linear-gradient(45deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        NetX SENTRY
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}
      >
        Next-Gen Network Forensic & Threat Intelligence Platform
      </motion.p>

      {/* Enter Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(56, 189, 248)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/dashboard')}
        style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        INITIALIZE SYSTEM
      </motion.button>
      
      {/* Footer Features */}
      <div style={{ display: 'flex', gap: '3rem', marginTop: '5rem', color: '#64748b' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}><Lock size={20}/> Encrypted Analysis</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}><Activity size={20}/> Real-time Detection</div>
      </div>
    </div>
  );
};

export default Landing;