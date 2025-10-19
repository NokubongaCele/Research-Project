A Digital Forensics Readiness Model for AI-Powered Cyber Attacks

CyberForensics Pro is an AI-powered digital forensics readiness platform designed to detect, analyze, and respond to AI-driven cyber attacks in real time.

This research project implements a comprehensive forensic readiness model specifically architected to address the emerging threat landscape of autonomous malware, AI-generated phishing campaigns, and deepfake attacks.

As artificial intelligence increasingly fuels cybercrime, with 57% of organizations worldwide reporting AI-related phishing or intrusion attempts — traditional digital forensic frameworks lack the adaptability to preserve and analyze evidence from intelligent and autonomous threats in real time.

CyberForensics Pro bridges this gap by providing a proactive forensic readiness architecture equipped with AI-driven threat detection, real-time monitoring, and blockchain-based evidence integrity mechanisms.

⚙️ Key Capabilities
🔍 Multi-Modal AI Threat Detection

Email Phishing Detection using DistilBERT (≈ 89.7% confidence)

Network Intrusion Detection using Random Forest trained on NSL-KDD dataset (≈ 91.6% confidence)

Ensemble Decision Logic combining AI predictions with rule-based heuristics

  Real-Time Monitoring

WebSocket-based live threat broadcasting

Sub-second response times (112–274 ms average)

Automated alert propagation and threat classification

 Blockchain Evidence Integrity

Immutable audit trails with cryptographic hash-chains

Tamper-proof logging ensuring forensic and legal admissibility

End-to-end chain of custody validation

 Interactive Dashboard

Real-time threat metrics and analytics

Incident response and case management

Attack simulation and forensic reporting tools

 Technology Stack
Layer	Technologies
Frontend	React 18, TypeScript, TailwindCSS, shadcn/ui
Backend	Node.js, Express.js, WebSocket (ws)
Database	PostgreSQL with Drizzle ORM
AI/ML Models	DistilBERT (ONNX), Random Forest (scikit-learn)
Authentication	Replit OIDC with Passport.js
Real-Time Engine	WebSocket for live updates
 Project Structure
├── client/          # React frontend
├── server/          # Express.js backend
│   ├── ml/          # AI detection models
│   └── models/      # ML model files (ONNX, pickle)
├── shared/          # Shared types & schemas
└── package.json     # Dependencies

 Running the Project
Prerequisites

Make sure you have the following installed:

Node.js v18+

PostgreSQL database (or a Neon
 serverless PostgreSQL instance)

npm or yarn

1. Clone the Repository
git clone https://github.com/NokubongaCele/Research-Project.git
cd Research-Project

2. Install Dependencies
npm install

3. Set Up Environment Variables

Create a .env file in the root directory with the following:

DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development

4. Run Database Migrations
npm run db:push

5. Start the Application
npm run dev


The application will start at:
👉 http://localhost:5000

⚙️ Components

🖥️ Frontend: Vite development server

⚙️ Backend: Express.js API server

🔄 WebSocket: Real-time threat detection endpoint at /ws

🌐 Accessing the Platform

Open http://localhost:5000
 in your browser

Authenticate via Replit OIDC

Once logged in, access:

Dashboard: Real-time metrics

Threat Detection: AI-powered analysis

Evidence Management: Blockchain logging

Analytics: Forensic insights

📦 Trained Models

Due to GitHub file size limitations, trained AI models are hosted externally:
https://drive.google.com/drive/folders/1FBXhvVyXEsG9JUv0KrB3W4hyb4KANbw9?usp=drive_link
