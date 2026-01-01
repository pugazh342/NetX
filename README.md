# 🛡️ NetX Sentry
> **Next-Gen Network Forensic & Threat Intelligence Platform**

![NetX Banner](https://img.shields.io/badge/Status-Active-success) ![Python](https://img.shields.io/badge/Backend-FastAPI-blue) ![React](https://img.shields.io/badge/Frontend-React_Vite-cyan) ![License](https://img.shields.io/badge/License-MIT-purple)

**NetX Sentry** is a modern Security Operations Center (SOC) tool designed for deep packet analysis. It ingests raw network capture files (`.pcap`, `.pcapng`), parses protocol metadata, visualizes traffic flows on a global cyber-map, and cross-references IPs against threat intelligence engines to detect malicious activity.

---

## 🚀 Key Features

* **📂 Drag-and-Drop Ingestion:** Support for raw `.pcap` and `.pcapng` files via a modern web interface.
* **🧠 Deep Packet Inspection:** Automated parsing of the "5-Tuple" (Src IP, Dst IP, Ports, Protocol) using PyShark.
* **🌍 "War Room" Cyber Map:** Interactive 3D-style world map visualizing attack vectors and traffic origins.
* **💀 Threat Intelligence Engine:** Real-time flagging of malicious IPs, identifying Known Attackers, C2 Servers, and Botnets.
* **📊 Analytics Dashboard:** Interactive charts for Protocol Distribution, Traffic Volume, and Risk Scoring.
* **📑 Automated Reporting:** One-click generation of professional Forensic PDF Reports for stakeholders.
* **⚡ High Performance:** Asynchronous backend processing powered by FastAPI and Python.

---

## 🛠️ Tech Stack

### **Backend (The Engine)**
* **Language:** Python 3.10+
* **Framework:** FastAPI (High-performance API)
* **Packet Parsing:** PyShark (TShark Wrapper)
* **Geo-Location:** MaxMind GeoLite2
* **Async Processing:** Nest_Asyncio

### **Frontend (The Dashboard)**
* **Framework:** React.js (Vite)
* **Visualization:** Recharts & React-Simple-Maps
* **Animations:** Framer Motion
* **Styling:** CSS Modules (Dark Mode / Cyber Theme)
* **Export:** jsPDF & HTML2Canvas

---

## 📸 Screenshots

| **Mission Control Dashboard** | **Forensic Report & Map** |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x300?text=Dashboard+UI) | ![Report](https://via.placeholder.com/600x300?text=Threat+Map) |
| *Real-time file ingestion & history* | *Geo-mapping & PDF Export* |

---

## ⚙️ Installation & Setup

### Prerequisites
1.  **Wireshark (TShark):** Must be installed on the system path. [Download Here](https://www.wireshark.org/download.html)
2.  **Node.js:** Required for the frontend.
3.  **Python 3.9+:** Required for the backend.

### 1. Backend Setup

# Clone the repository
```bash
git clone [https://github.com/yourusername/NetX-Sentry.git](https://github.com/yourusername/NetX-Sentry.git)
cd NetX
```

# Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

# Install Dependencies
```bash
pip install fastapi uvicorn pyshark geoip2 nest_asyncio python-multipart
```
# ⚠️ IMPORTANT:
# Place the 'GeoLite2-City.mmdb' file inside: backend/app/engine/

## Frontend Setup
```bash
cd frontend

# Install Node Modules
npm install
# Note: If you get upstream dependency errors, use:
# npm install --legacy-peer-deps
```

## How to Run

### Option A : The "One-Click" Launcher (Windows)
**Simply double-click the run.bat file in the root directory. It will launch both servers and open your browser automatically.**
### Option B : Manual Launch
**Terminal-1:(Backend)**
```bash
source venv/bin/activate
python -m backend.app.main
```
**Terminal-2:(Frontend)**
```bash
cd frontend
npm run dev
```
Open your browser and navigate to [http://localhost:5173](http://localhost:5173)
---

## 📝 Documentation

For detailed documentation, visit the [NetX Sentry Documentation](https://github.com/yourusername/NetX-Sentry/wiki).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.
---

## 📂 Project Structure
```plaintext
NetX-Sentry/
├── backend/
│   ├── app/
│   │   ├── engine/
│   │   │   ├── parser.py       # Core Packet Logic
│   │   │   ├── threat.py       # Threat Intelligence
│   │   │   └── GeoLite2.mmdb   # Geo Database
│   │   └── main.py             # FastAPI Server
│   └── uploads/                # Temp storage
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Loader, CyberMap
│   │   ├── pages/              # Dashboard, Report, Landing
│   │   └── App.jsx             # Router Logic
├── run.bat                     # Windows Launcher
└── README.md
```

## 🔮 Roadmap
**[ ] Integration with Live Capture (Sniffing Mode).**

**[ ] AbuseIPDB API Integration for live threat data.**

**[ ] User Authentication (Login/Signup).**

**[ ] Docker Containerization.**

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

**Built with 💻 and ☕ by Pugazhmani.K**


### **One Last Tip for You:**
Since I put "placeholder" images in the Screenshot section, you should:
1.  Run your app.
2.  Take a screenshot of the **Dashboard** and the **Map**.
3.  Save them in your folder (e.g., inside a `docs/` folder).
4.  Update the `README.md` image links to point to your real screenshots!

**Project Complete!** 🚀
