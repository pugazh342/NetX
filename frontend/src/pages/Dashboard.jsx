import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Clock, FileText, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from local storage on component mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('netx_history') || '[]');
      setHistory(saved);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Connect to Python Backend
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const resultData = response.data;
      
      // Create History Entry
      const newEntry = {
        id: Date.now(),
        filename: resultData.filename,
        date: new Date().toLocaleString(),
        packet_count: resultData.packet_count,
        data: resultData.data // Store the actual packet data
      };
      
      // Update Local Storage (Keep last 5 entries)
      const updatedHistory = [newEntry, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('netx_history', JSON.stringify(updatedHistory));
      
      // Navigate to Report Page with Data
      navigate('/report', { state: { reportData: resultData } });

    } catch (err) {
      console.error(err);
      alert("Analysis Failed. Ensure Backend is running at port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry) => {
    // Reconstruct the data structure expected by the Report page
    const reportData = {
        filename: entry.filename,
        packet_count: entry.packet_count,
        data: entry.data
    };
    navigate('/report', { state: { reportData } });
  };

  return (
    <>
      <Navbar />
      
      <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Mission Control</h2>

        {/* Upload Area */}
        <div style={{ 
            border: '2px dashed #334155', 
            borderRadius: '12px', 
            padding: '4rem', 
            textAlign: 'center', 
            backgroundColor: '#1e293b', 
            marginBottom: '3rem',
            transition: 'border-color 0.3s'
        }}>
          <Upload size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>Initialize New Analysis</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Drag & drop PCAP or PCAPNG files here</p>
          
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={handleUpload}
            accept=".pcap,.pcapng" 
          />
          <label 
            htmlFor="file-upload" 
            style={{ 
                background: '#38bdf8', 
                color: '#0f172a', 
                padding: '0.8rem 2rem', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "PROCESSING TRAFFIC..." : "UPLOAD CAPTURE"}
          </label>
        </div>

        {/* Recent History */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock size={20} color="#38bdf8"/> Recent Investigations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.length === 0 && <p style={{ color: '#64748b' }}>No recent investigations found.</p>}
            
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => loadFromHistory(item)} 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#1e293b', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: '1px solid #334155', 
                    transition: 'transform 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '8px' }}>
                    <FileText color="#38bdf8" size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.filename}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{item.date} • {item.packet_count} Packets</div>
                  </div>
                </div>
                <ChevronRight color="#64748b" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;