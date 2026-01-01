import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Optional: Clear session data if needed
    // localStorage.removeItem('netx_history'); 
    navigate('/');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      backgroundColor: '#1e293b', 
      borderBottom: '1px solid #334155',
      marginBottom: '2rem'
    }}>
      
      {/* Logo Section */}
      <div 
        onClick={() => navigate('/dashboard')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
      >
        <Shield size={28} color="#38bdf8" fill="rgba(56, 189, 248, 0.1)" />
        <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px' }}>
          NetX <span style={{ color: '#38bdf8' }}>SENTRY</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        
        {/* Only show 'Report' link if we are actually viewing a report */}
        {isActive('/report') && (
          <span style={linkStyle(true)}>
            <FileText size={18} /> Active Report
          </span>
        )}
      </div>

      {/* Right Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          style={{ background: 'transparent', color: '#94a3b8', padding: 0 }} 
          title="Settings (Demo)"
        >
          <Settings size={20} />
        </button>
        
        <div style={{ height: '20px', width: '1px', backgroundColor: '#334155' }}></div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.9rem'
          }}
        >
          <LogOut size={16} /> Disconnect
        </button>
      </div>
    </nav>
  );
};

// Helper style function for links
const linkStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
  color: active ? '#38bdf8' : '#94a3b8',
  fontWeight: active ? 'bold' : 'normal',
  transition: 'color 0.2s ease',
  fontSize: '0.95rem'
});

export default Navbar;