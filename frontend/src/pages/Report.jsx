import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, AlertTriangle, ShieldCheck, Globe, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import CyberMap from '../components/CyberMap'; // Ensure this exists

const Report = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // 1. Safety Check: If user accesses /report directly without data
  if (!state || !state.reportData) {
    return (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <h2>No Analysis Data Found</h2>
            <button 
                onClick={() => navigate('/dashboard')}
                style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Return to Dashboard
            </button>
        </div>
    );
  }

  const { data, packet_count, filename } = state.reportData;

  // --- ANALYTICS ENGINE ---
  const maliciousPackets = data.filter(p => p.is_malicious);
  const maliciousCount = maliciousPackets.length;
  
  // Extract Unique IOCs (IPs or Domains) for the Report Cards
  // We use a Set to remove duplicates based on the 'ioc_value'
  const uniqueIOCs = [...new Set(maliciousPackets.map(p => {
      return JSON.stringify({ value: p.ioc_value, type: p.threat_type }); 
  }))].map(JSON.parse);

  // Risk Scoring Logic
  let riskLevel = "LOW";
  let riskColor = "#4ade80"; // Green

  if (maliciousCount > 0) { 
      riskLevel = "MEDIUM"; 
      riskColor = "#fbbf24"; // Yellow
  }
  if (maliciousCount > 10 || uniqueIOCs.some(i => i.type.includes("C2") || i.type.includes("Malware"))) { 
      riskLevel = "CRITICAL"; 
      riskColor = "#ef4444"; // Red
  }

  // Helper for Chart Data
  const getProtocolStats = () => {
    const counts = {};
    data.forEach(pkt => {
        const p = pkt.protocol || "Unknown";
        counts[p] = (counts[p] || 0) + 1;
    });
    return Object.keys(counts).map(k => ({ name: k, count: counts[k] }));
  };

  // --- PDF EXPORT FUNCTION ---
  const downloadPDF = () => {
    const input = document.getElementById('report-content');
    
    // Style adjustments for clean PDF rendering
    const originalBackground = input.style.background;
    const originalPadding = input.style.padding;
    input.style.background = '#0f172a'; 
    input.style.padding = '30px';

    html2canvas(input, { scale: 2, backgroundColor: '#0f172a', useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NetX_Report_${filename}.pdf`);
      
      // Revert styles
      input.style.background = originalBackground;
      input.style.padding = originalPadding;
    });
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: '0 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#94a3b8', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>
            <ArrowLeft size={18}/> Back to Dashboard
          </button>
          
          <button onClick={downloadPDF} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#38bdf8', color: '#0f172a', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            <Download size={18}/> Export PDF Report
          </button>
        </div>

        {/* --- REPORT PRINT AREA START --- */}
        <div id="report-content" style={{ background: '#0f172a' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Forensic Analysis Report</h1>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                   <span>File: <strong style={{color: '#f8fafc'}}>{filename}</strong></span>
                   <span>Date: {new Date().toLocaleDateString()}</span>
                   <span>Status: <strong style={{color: riskColor}}>{riskLevel} RISK</strong></span>
                </div>
            </div>
            
            {/* 1. Executive Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Risk Score</div>
                    <h2 style={{ color: riskColor, fontSize: '2rem', margin: '0.5rem 0' }}>{riskLevel}</h2>
                </div>
                <div className="card">
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Packets</div>
                    <h2>{packet_count}</h2>
                </div>
                <div className="card">
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Threats Found</div>
                    <h2 style={{ color: maliciousCount > 0 ? '#ef4444' : '#fff' }}>{maliciousCount}</h2>
                </div>
                <div className="card">
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Unique IOCs</div>
                    <h2>{uniqueIOCs.length}</h2>
                </div>
            </div>

            {/* 2. Threat Intelligence Section (IOC Grid) */}
            {maliciousCount > 0 ? (
            <div className="card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginTop: 0 }}>
                    <AlertTriangle /> Active Threats Detected (IOCs)
                </h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                    The following Indicators of Compromise were matched against the Threat Intelligence Database:
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {uniqueIOCs.map((ioc, i) => (
                        <div key={i} style={{ background: '#1e293b', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>IOC DETECTED</div>
                            <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 'bold', margin: '0.3rem 0', fontFamily: 'monospace' }}>
                                {ioc.value}
                            </div>
                            <div style={{ color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Activity size={14}/> {ioc.type}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            ) : (
            <div className="card" style={{ borderLeft: '4px solid #4ade80', marginBottom: '2rem', backgroundColor: 'rgba(74, 222, 128, 0.05)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', marginTop: 0 }}>
                    <ShieldCheck /> System Clean
                </h3>
                <p style={{ color: '#94a3b8' }}>No IOCs or known threat signatures were detected in this capture file.</p>
            </div>
            )}

            {/* 3. Global Cyber Map */}
            <div className="card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
                    <h3 style={{ margin: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Globe size={20}/> Global Traffic Map</h3>
                </div>
                <div style={{ padding: '1rem' }}>
                    <CyberMap data={data} />
                </div>
            </div>

            {/* 4. Protocol Chart */}
            <div className="card" style={{ height: '350px', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Protocol Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getProtocolStats()}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 5. Detailed Traffic Table (First 50 Packets) */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Traffic Log (Sample)</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Time</th>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Source</th>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Destination</th>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Protocol</th>
                            <th style={{ textAlign: 'left', padding: '10px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 50).map((p, i) => (
                        <tr key={i} style={p.is_malicious ? { backgroundColor: 'rgba(239, 68, 68, 0.1)' } : { borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '10px', fontSize: '0.85rem', color: '#64748b' }}>{p.timestamp}</td>
                            <td style={{ padding: '10px' }}>
                                <div style={{ color: p.is_malicious ? '#fca5a5' : '#4ade80' }}>{p.src_ip}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>[{p.src_country}]</div>
                            </td>
                            <td style={{ padding: '10px' }}>
                                <div style={{ color: p.is_malicious ? '#fca5a5' : '#f87171' }}>{p.dst_ip}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>[{p.dst_country}]</div>
                            </td>
                            <td style={{ padding: '10px' }}>
                                <span style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{p.protocol}</span>
                            </td>
                            <td style={{ padding: '10px' }}>
                                {p.is_malicious 
                                ? <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem' }}>⚠️ {p.threat_type}</span>
                                : <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Clean</span>
                                }
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
        {/* --- REPORT PRINT AREA END --- */}

      </div>
    </>
  );
};

export default Report;