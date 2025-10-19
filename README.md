# A DIGITAL FORENSICS READINESS MODEL FOR AI-POWERED CYBER ATTACKS

CyberForensics Pro is an AI-powered digital forensics readiness platform designed to detect, analyze, and respond to AI-driven cyber attacks in real time.

This research project implements a comprehensive forensic readiness model specifically architected to address the emerging threat landscape of autonomous malware, AI-generated phishing campaigns, and deepfake attacks.


This platform bridges that gap by providing a proactive forensic readiness architecture integrating:

AI-based threat detection

Blockchain evidence integrity

Real-time monitoring and reporting

##  KEY CAPABILITIES
## MULTI-MODAL AI THREAT DETECTION

Email phishing detection using DistilBERT transformer models (≈89.7% confidence)

Network intrusion detection using Random Forest trained on NSL-KDD dataset (≈91.6% confidence)

Ensemble hybrid analysis combining AI predictions with rule-based heuristics

### REAL-TIME MONITORING

 WebSocket-based threat broadcasting

Live dashboard updates for threat analytics

### BLOCKCHAIN EVIDENCE INTEGRITY

Cryptographic hash-chain verification for immutable audit trails

Tamper-proof blockchain evidence logging

Full chain of custody and integrity verification

### INTERACTIVE DASHBOARD

Live threat metrics and analytics

Incident response and case management

Attack simulation and forensic reporting

### TECHNOLOGY STACK
#### LAYER	TECHNOLOGIES
Frontend	React 18, TypeScript, TailwindCSS, shadcn/ui
Backend	Node.js, Express.js, WebSocket (ws)
Database	PostgreSQL + Drizzle ORM
AI/ML Models	DistilBERT (ONNX), Random Forest (scikit-learn)
Authentication	Replit OIDC + Passport.js
Real-Time Engine	WebSocket for live updates


##  PROJECT STRUCTURE


├── client/          # React frontend


├── server/          # Express.js backend


│   ├── ml/          # AI detection models


│   └── models/      # ML model files (ONNX, pickle)


├── shared/          # Shared types & schemas


└── package.json     # Dependencies



# RUNNING THE PROJECT
PREREQUISITES

Node.js v18+

PostgreSQL (or Neon serverless PostgreSQL)

npm or yarn package manager

### 1️⃣ CLONE THE REPOSITORY


git clone https://github.com/NokubongaCele/Research-Project.git
cd Research-Project



### 2️⃣ INSTALL DEPENDENCIES


npm install



### 3️⃣ SET UP ENVIRONMENT VARIABLES


Create a .env file in the root directory:


DATABASE_URL=your_postgresql_connection_string


NODE_ENV=development


### 4️⃣ RUN DATABASE MIGRATIONS


npm run db:push



### 5️⃣ START THE APPLICATION


npm run dev


The application will start at http://localhost:5000


# COMPONENTS

Frontend: Vite development server


Backend: Express.js API server



WebSocket: Real-time threat detection endpoint (/ws)



### ACCESSING THE PLATFORM

Open http://localhost:5000



Authenticate via Replit OIDC



Access key modules:



Dashboard: Real-time metrics



Threat Detection: AI-powered analysis



Evidence Management: Blockchain logging



Analytics: Forensic insights



### TRAINED MODELS

Due to GitHub file size limits, trained AI models are hosted externally:


### Installation


After downloading, place the model files in the correct directory:


Navigate to server/models/phishing/ in your project folder


Copy the downloaded files into this directory


Your folder structure should look like this:



server/


└── models/


    └── phishing/

    
        ├── model.onnx          ← Place here

        
        ├── network_model.pkl   ← Place here

        
        ├── tokenizer.json      ← Place here

        
        
Verification


To verify the models are correctly installed, check that these files exist:


server/models/phishing/model.onnx


server/models/phishing/network_model.pkl


server/models/phishing/tokenizer.json


The application will automatically load these models on startup. If models are missing, the system will fall back to simulated detection mode.

Link:


https://drive.google.com/drive/folders/1FBXhvVyXEsG9JUv0KrB3W4hyb4KANbw9?usp=drive_link
