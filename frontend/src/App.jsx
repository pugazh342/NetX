import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import LoadingScreen from './components/LoadingScreen';

// Helper component to handle route change detection
const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Trigger loading on route change
    setLoading(true);
    
    // Fake a short delay (800ms) to show the cool animation
    // In a real app with big data, you wouldn't need the timeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Runs every time the path changes

  return (
    <>
      {loading && <LoadingScreen />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
        <PageLoader>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </PageLoader>
      </div>
    </Router>
  );
}

export default App;