import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0f172a', // Dark background
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      {/* Animated Radar/Shield Container */}
      <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Pulsing Ring 1 */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '2px solid #38bdf8',
            borderRadius: '50%',
          }}
        />
        
        {/* Pulsing Ring 2 (Delayed) */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '1px solid #38bdf8',
            borderRadius: '50%',
          }}
        />

        {/* Central Icon */}
        <Shield size={40} color="#38bdf8" fill="rgba(56, 189, 248, 0.2)" />
      </div>

      {/* Text Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: '2rem', textAlign: 'center' }}
      >
        <h3 style={{ color: '#f8fafc', letterSpacing: '2px', margin: 0 }}>
          SYSTEM INITIALIZING
        </h3>
        <div style={{ color: '#38bdf8', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={16} />
          </motion.span>
          ESTABLISHING SECURE CONNECTION...
        </div>
      </motion.div>

      {/* Progress Bar Line */}
      <div style={{ width: '200px', height: '2px', background: '#1e293b', marginTop: '1.5rem', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)' }}
        />
      </div>

    </div>
  );
};

export default LoadingScreen;