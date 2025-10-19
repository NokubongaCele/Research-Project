CyberForensics Pro is an AI-powered digital forensics readiness platform designed to detect, analyze, and respond to AI-driven cyber attacks in real time.

This research project implements a comprehensive forensic readiness model specifically architected to address the emerging threat landscape of autonomous malware, AI-generated phishing campaigns, and deepfake attacks.

Running the Project

Make sure you have the following installed:


Node.js 18+ installed


PostgreSQL database (or Neon account for serverless PostgreSQL)


npm or yarn package manager




1. Clone the repository:


git clone https://github.com/NokubongaCele/Research-Project.git
cd Research-Project




2. Install dependencies:

   
npm install




3. Set up environment variables:

   
Create a .env file in the root directory with:


DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development




4. Run database migrations:

   
npm run db:push




5. Start the Application

   
npm run dev


The application will start on http://localhost:5000



Components:


Frontend: Vite development server


Backend: Express.js API server


WebSocket: Real-time threat detection at /ws



Accessing the Platform:


Open your browser to http://localhost:5000


You'll be redirected to authenticate (Replit OIDC)


Once logged in, access:


Dashboard: Real-time metrics


Threat Detection: AI-powered analysis


Evidence Management: Blockchain logging


Analytics: Forensic insights



Trained Models: 


Due to file size limits, trained models are hosted on Google Drive:
https://drive.google.com/drive/folders/1FBXhvVyXEsG9JUv0KrB3W4hyb4KANbw9?usp=drive_link
