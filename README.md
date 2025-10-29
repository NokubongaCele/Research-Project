# CyberForensics Pro
## A Digital Forensics Readiness Model for AI-Powered Cyber Attacks
CyberForensics Pro is an AI-powered digital forensics readiness platform designed to detect, analyze, and respond to AI-driven cyber attacks in real time.
This research project implements a comprehensive forensic readiness model specifically architected to address the emerging threat landscape of autonomous malware, AI-generated phishing campaigns, and advanced persistent threats.
The platform bridges critical gaps in modern cybersecurity by providing a proactive forensic readiness architecture that integrates:
- **AI-based threat detection**
- **Blockchain evidence integrity**
- **Real-time monitoring and reporting**
---
## Key Capabilities
### 🤖 Multi-Modal AI Threat Detection
- **Email Phishing Detection**: DistilBERT transformer models with ≈89.7% confidence
- **Network Intrusion Detection**: Random Forest classifier trained on NSL-KDD dataset with ≈91.6% confidence
- **Ensemble Hybrid Analysis**: Combines AI predictions with rule-based heuristics for enhanced accuracy
### 📡 Real-Time Monitoring
- WebSocket-based threat broadcasting
- Live dashboard updates for threat analytics
- Continuous monitoring capabilities
### 🔐 Blockchain Evidence Integrity
- Cryptographic hash-chain verification for immutable audit trails
- Tamper-proof blockchain evidence logging
- Full chain of custody and integrity verification
### 📊 Interactive Dashboard
- Live threat metrics and analytics
- Incident response and case management
- Attack simulation capabilities
- Comprehensive forensic reporting
---
## Technology Stack
| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, TailwindCSS, shadcn/ui |
| **Backend** | Node.js, Express.js, WebSocket (ws) |
| **Database** | PostgreSQL + Drizzle ORM |
| **AI/ML Models** | DistilBERT (ONNX), Random Forest (scikit-learn) |
| **Authentication** | Replit OIDC + Passport.js |
| **Real-Time Engine** | WebSocket for live updates |
---
## Project Structure
├── client/ # React frontend


├── server/ # Express.js backend


│ ├── ml/ # AI detection models


│ └── models/ # ML model files (ONNX, pickle)


├── shared/ # Shared types & schemas


├── package.json # Dependencies


└── README.md # This file


## Installation & Setup
### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** (or Neon serverless PostgreSQL)
- **npm** or **yarn** package manager
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/NokubongaCele/Research-Project.git
cd Research-Project
2️⃣ Install Dependencies
npm install
3️⃣ Download AI Model Files
Due to GitHub file size limits (100MB max), the trained AI models are hosted externally.

📥 Download Link:https://drive.google.com/drive/folders/1FBXhvVyXEsG9JUv0KrB3W4hyb4KANbw9?usp=drive_link
Required Files:

model.onnx (255 MB) - DistilBERT phishing detection model
network_model.pkl (671 MB) - Random Forest network intrusion model
tokenizer.json - DistilBERT tokenizer configuration
Installation Steps:
Link: https://drive.google.com/drive/folders/1FBXhvVyXEsG9JUv0KrB3W4hyb4KANbw9?usp=drive_link
Download all files from the Google Drive link above
Navigate to server/models/phishing/ in your project folder
Copy the downloaded files into this directory
Your folder structure should look like this:

server/
└── models/
    └── phishing/
        ├── model.onnx          ← Place here
        ├── network_model.pkl   ← Place here
        └── tokenizer.json      ← Place here
Verification: Check that these files exist before running the application:

server/models/phishing/model.onnx
server/models/phishing/network_model.pkl
server/models/phishing/tokenizer.json
⚠️ Note: If models are missing, the system will fall back to simulated detection mode with reduced accuracy.

4️⃣ Set Up Environment Variables
Create a .env file in the root directory:

DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
5️⃣ Run Database Migrations
npm run db:push
6️⃣ Start the Application
npm run dev
The application will start at http://localhost:5000

Components:

Frontend: Vite development server
Backend: Express.js API server
WebSocket: Real-time threat detection endpoint (/ws)
Accessing the Platform
Open http://localhost:5000 in your browser
Authenticate via Replit OIDC
Access key modules:
Dashboard: Real-time metrics and threat visualization
Threat Detection: AI-powered analysis
Evidence Management: Blockchain logging
Analytics: Forensic insights and reports
Features Overview
Threat Detection
Real-time email phishing analysis using transformer models
Network traffic intrusion detection
Confidence scoring and threat classification
Evidence Management
Blockchain-based evidence logging with cryptographic verification
Immutable audit trails for forensic investigations
Chain of custody tracking
Incident Response
Case management and incident tracking
Automated evidence collection
Forensic report generation
Attack Simulation
Autonomous malware simulation
AI phishing campaign testing
Detection system validation
Analytics & Reporting
Live threat metrics dashboard
Historical analytics and trends
Exportable forensic reports
Research Context
This platform was developed as part of COS700 research on digital forensics readiness for AI-powered cyber attacks. The system addresses the critical need for proactive forensic capabilities in an era of increasingly sophisticated AI-driven threats.
