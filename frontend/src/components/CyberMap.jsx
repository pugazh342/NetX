import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

// 1. URL to a basic world map topology (Publicly hosted)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 2. Simple Coordinate Dictionary (Mapping ISO Codes to Lat/Long)
// In a full production app, you'd use a complete library for this.
const GEO_COORDS = {
  "US": [-95.7129, 37.0902], // USA
  "CN": [104.1954, 35.8617], // China
  "IN": [78.9629, 20.5937],  // India
  "RU": [105.3188, 61.5240], // Russia
  "DE": [10.4515, 51.1657],  // Germany
  "GB": [-3.435, 55.3781],   // UK
  "FR": [2.2137, 46.2276],   // France
  "JP": [138.2529, 36.2048], // Japan
  "BR": [-51.9253, -14.2350], // Brazil
  "AU": [133.7751, -25.2744], // Australia
  "CA": [-106.3468, 56.1304], // Canada
  "Internal": [-95, 37]      // Default Internal to US center for demo (or hide it)
};

const CyberMap = ({ data }) => {
  
  // 3. Process Data: Create unique links between countries
  const links = useMemo(() => {
    const uniqueLinks = [];
    const seen = new Set();

    data.forEach(pkt => {
      // Skip if we don't have coords for a country
      if (!GEO_COORDS[pkt.src_country] || !GEO_COORDS[pkt.dst_country]) return;
      
      // Skip internal traffic (same country) to avoid messy dots
      if (pkt.src_country === pkt.dst_country) return;

      const key = `${pkt.src_country}-${pkt.dst_country}`;
      if (!seen.has(key)) {
        uniqueLinks.push({
          from: GEO_COORDS[pkt.src_country],
          to: GEO_COORDS[pkt.dst_country],
          is_malicious: pkt.is_malicious
        });
        seen.add(key);
      }
    });
    return uniqueLinks;
  }, [data]);

  return (
    <div style={{ width: '100%', height: '500px', background: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 100 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Draw the dark world map */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Draw Connection Lines */}
        {links.map((link, i) => (
          <Line
            key={i}
            from={link.from}
            to={link.to}
            stroke={link.is_malicious ? "#ef4444" : "#38bdf8"} // Red for bad, Blue for good
            strokeWidth={2}
            strokeOpacity={0.6}
            strokeLinecap="round"
          />
        ))}

        {/* Draw Markers (Endpoints) */}
        {links.map((link, i) => (
          <React.Fragment key={`marker-${i}`}>
            <Marker coordinates={link.from}>
              <circle r={3} fill="#fff" />
            </Marker>
            <Marker coordinates={link.to}>
              <circle r={3} fill="#fff" />
            </Marker>
          </React.Fragment>
        ))}
      </ComposableMap>
      
      {/* Legend Overlay */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '10px', height: '2px', background: '#38bdf8' }}></div> Normal Traffic
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
          <div style={{ width: '10px', height: '2px', background: '#ef4444' }}></div> Threat Detected
        </div>
      </div>
    </div>
  );
};

export default CyberMap;