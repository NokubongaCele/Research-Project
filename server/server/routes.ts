import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { WebSocketServer, WebSocket } from 'ws';
import { phishingDetector } from './ml/phishing';
import { networkDetector } from './ml/network';

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  function broadcastToClients(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Threat routes
  app.get("/api/threats", isAuthenticated, async (req, res) => {
    try {
      const threats = await storage.getThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  app.post("/api/threats", isAuthenticated, async (req, res) => {
    try {
      const threat = await storage.createThreat(req.body);
      res.json(threat);
    } catch (error) {
      console.error("Error creating threat:", error);
      res.status(500).json({ message: "Failed to create threat" });
    }
  });

  // ML prediction route
  app.post("/api/ml/phishing/predict", isAuthenticated, async (req, res) => {
    try {
      const { emailText } = req.body;
      
      if (!emailText || typeof emailText !== 'string') {
        return res.status(400).json({ message: "Email text is required" });
      }

      if (emailText.length > 32768) { // 32KB limit
        return res.status(400).json({ message: "Email text too long" });
      }

      const prediction = await phishingDetector.predict(emailText);
      
      console.log('Prediction result:', prediction); // Debug log
      
      res.json({
        prediction,
        modelStatus: phishingDetector.isReady() ? 'ready' : 'simulated',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error predicting phishing:", error);
      res.status(500).json({ message: "Failed to analyze email" });
    }
  });

  // Email scanning route (prediction + threat creation)
  app.post("/api/threats/scan-email", isAuthenticated, async (req, res) => {
    try {
      const { emailText, source } = req.body;
      
      if (!emailText || typeof emailText !== 'string') {
        return res.status(400).json({ message: "Email text is required" });
      }

      if (emailText.length > 32768) { // 32KB limit
        return res.status(400).json({ message: "Email text too long" });
      }

      // Run ML prediction
      const prediction = await phishingDetector.predict(emailText);
      
      let threat: any = null;
      
      // Create threat if phishing detected with high confidence
      if (prediction.isPhishing && prediction.confidence > 0.6) {
        const severity = prediction.confidence > 0.8 ? 'high' : 'medium';
        
        threat = await storage.createThreat({
          type: 'ai_phishing',
          severity,
          source: source || 'Email Analysis',
          aiConfidence: Math.round(prediction.confidence * 100),
          description: `AI-detected phishing email with ${Math.round(prediction.confidence * 100)}% confidence`,
          detected: true
        });

        // Broadcast via WebSocket
        broadcastToClients('threat_detected', threat);
      }

      res.json({
        threat,
        prediction,
        modelStatus: phishingDetector.isReady() ? 'ready' : 'simulated'
      });
    } catch (error) {
      console.error("Error scanning email:", error);
      res.status(500).json({ message: "Failed to scan email" });
    }
  });

  // Network ML prediction route
  app.post("/api/ml/network/predict", isAuthenticated, async (req, res) => {
    try {
      const { networkData } = req.body;
      
      if (!networkData) {
        return res.status(400).json({ message: "Network data is required" });
      }

      // Parse network features from input data
      const features = networkDetector.parseNetworkConnection(networkData);
      const prediction = await networkDetector.predict(features);
      
      res.json({
        prediction,
        features,
        modelStatus: networkDetector.isReady() ? 'ready' : 'simulated',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error predicting network intrusion:", error);
      res.status(500).json({ message: "Failed to analyze network traffic" });
    }
  });

  // Network traffic scanning route (prediction + threat creation)
  app.post("/api/threats/scan-network", isAuthenticated, async (req, res) => {
    try {
      const { networkData, source } = req.body;
      
      if (!networkData) {
        return res.status(400).json({ message: "Network data is required" });
      }

      // Parse network features and run prediction
      const features = networkDetector.parseNetworkConnection(networkData);
      const prediction = await networkDetector.predict(features);
      
      let threat: any = null;
      
      // Create threat if attack detected with sufficient confidence
      if (prediction.isAttack && prediction.confidence > 0.5) {
        const severityMap = {
          'critical': 'high',
          'high': 'high', 
          'medium': 'medium',
          'low': 'low'
        };
        
        const severity = severityMap[prediction.threatLevel] || 'medium';
        
        threat = await storage.createThreat({
          type: 'network_intrusion',
          severity,
          source: source || 'Network Analysis',
          aiConfidence: Math.round(prediction.confidence * 100),
          description: `Network intrusion detected: ${prediction.attackType} (${Math.round(prediction.confidence * 100)}% confidence)`,
          detected: true
        });

        // Broadcast via WebSocket
        broadcastToClients('threat_detected', threat);
      }

      res.json({
        threat,
        prediction,
        features,
        modelStatus: networkDetector.isReady() ? 'ready' : 'simulated'
      });
    } catch (error) {
      console.error("Error scanning network traffic:", error);
      res.status(500).json({ message: "Failed to scan network traffic" });
    }
  });

  // Evidence routes
  app.get("/api/evidence", isAuthenticated, async (req, res) => {
    try {
      const evidence = await storage.getEvidence();
      res.json(evidence);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      res.status(500).json({ message: "Failed to fetch evidence" });
    }
  });

  app.post("/api/evidence", isAuthenticated, async (req, res) => {
    try {
      const evidence = await storage.createEvidence(req.body);
      res.json(evidence);
    } catch (error) {
      console.error("Error creating evidence:", error);
      res.status(500).json({ message: "Failed to create evidence" });
    }
  });

  // Incident routes
  app.get("/api/incidents", isAuthenticated, async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.post("/api/incidents", isAuthenticated, async (req, res) => {
    try {
      const incident = await storage.createIncident(req.body);
      res.json(incident);
    } catch (error) {
      console.error("Error creating incident:", error);
      res.status(500).json({ message: "Failed to create incident" });
    }
  });

  // Simulation routes
  app.get("/api/simulations", isAuthenticated, async (req, res) => {
    try {
      const simulations = await storage.getSimulations();
      res.json(simulations);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });

  app.post("/api/simulations", isAuthenticated, async (req, res) => {
    try {
      const simulation = await storage.createSimulation(req.body);
      res.json(simulation);
    } catch (error) {
      console.error("Error creating simulation:", error);
      res.status(500).json({ message: "Failed to create simulation" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", isAuthenticated, async (req, res) => {
    try {
      // Return empty analytics for now
      res.json([]);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/:period", isAuthenticated, async (req, res) => {
    try {
      const { period } = req.params;
      
      // Mock analytics data
      const analytics = {
        period,
        threatTrend: [
          { date: '2024-01-01', threats: 5, detected: 4 },
          { date: '2024-01-02', threats: 8, detected: 7 },
          { date: '2024-01-03', threats: 12, detected: 10 },
          { date: '2024-01-04', threats: 6, detected: 6 },
          { date: '2024-01-05', threats: 9, detected: 8 },
          { date: '2024-01-06', threats: 15, detected: 13 },
          { date: '2024-01-07', threats: 11, detected: 10 }
        ],
        aiAccuracy: [
          { model: 'DeepFake Detection', accuracy: 94.2 },
          { model: 'Malware Analysis', accuracy: 87.8 },
          { model: 'Phishing Detection', accuracy: 91.5 },
          { model: 'Behavioral Analysis', accuracy: 89.3 }
        ],
        incidentTypes: [
          { type: 'AI-Generated Content', count: 8, percentage: 35 },
          { type: 'Autonomous Malware', count: 6, percentage: 26 },
          { type: 'Social Engineering', count: 5, percentage: 22 },
          { type: 'Data Manipulation', count: 4, percentage: 17 }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard metrics route
  app.get("/api/dashboard/metrics", isAuthenticated, async (req, res) => {
    try {
      const [threats, evidence, incidents, simulations] = await Promise.all([
        storage.getThreats(),
        storage.getEvidence(),
        storage.getIncidents(),
        storage.getSimulations(),
      ]);

      const metrics = {
        activeThreats: threats.filter((t: any) => !t.detected).length,
        aiDetections: threats.filter((t: any) => t.detected && t.aiConfidence && t.aiConfidence > 0.8).length,
        evidenceLogged: evidence.length,
        responseTime: '2.3s',
        recentThreats: threats.slice(0, 5),
        activeIncidents: incidents.filter((i: any) => i.status === 'open' || i.status === 'investigating'),
        recentEvidence: evidence.slice(0, 5),
        completedSimulations: simulations.filter((s: any) => s.status === 'completed').length,
        averageDetectionRate: simulations
          .filter((s: any) => s.detectionRate)
          .reduce((acc: number, s: any) => acc + (s.detectionRate || 0), 0) / 
          simulations.filter((s: any) => s.detectionRate).length || 0,
      };

      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Reports routes
  app.get('/api/reports/preview', isAuthenticated, async (req, res) => {
    try {
      const { type, dateRange } = req.query;
      
      const previewData = {
        incidents: 3,
        threats: 12,
        evidence: 8,
        aiDetections: 9,
        blockedAttacks: 5,
        criticalAlerts: 2,
        reportType: type,
        dateRange,
        generatedAt: new Date().toISOString()
      };
      
      res.json(previewData);
    } catch (error) {
      console.error('Error fetching report preview:', error);
      res.status(500).json({ message: 'Failed to fetch report preview' });
    }
  });

  app.post('/api/reports/generate', isAuthenticated, async (req, res) => {
    try {
      const { type, dateRange, format, title, description } = req.body;
      
      const reportData = {
        id: `report_${Date.now()}`,
        type,
        title: title || `Forensic Report - ${type}`,
        description,
        format,
        dateRange,
        generatedAt: new Date().toISOString(),
        generatedBy: (req.user as any)?.claims?.sub,
        size: '2.4MB',
        pages: Math.floor(Math.random() * 20) + 10,
        downloadUrl: `/api/reports/download/report_${Date.now()}.${format}`
      };
      
      res.json(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ message: 'Failed to generate report' });
    }
  });

  // Simulate real-time threat detection
  setInterval(async () => {
    const threatTypes = ['deepfake', 'autonomous_malware', 'ai_phishing'];
    const severities = ['critical', 'high', 'medium', 'low'];
    
    if (Math.random() < 0.1) { // 10% chance every 30 seconds
      const threat = await storage.createThreat({
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: `192.168.1.${Math.floor(Math.random() * 255)}`,
        description: `AI-powered attack detected from automated monitoring`,
        detected: true,
        aiConfidence: Math.random() * 0.3 + 0.7,
      });
      
      broadcastToClients('threat_detected', threat);
    }
  }, 30000);

  return httpServer;
}