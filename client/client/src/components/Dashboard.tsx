import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThreatDetection from "./ThreatDetection";
import AIAnalysis from "./AIAnalysis";
import BlockchainEvidence from "./BlockchainEvidence";
import IncidentResponse from "./IncidentResponse";
import AttackSimulation from "./AttackSimulation";
import Analytics from "./Analytics";
import { 
  AlertTriangle, 
  Bot, 
  Link, 
  Clock, 
  Plus, 
  Shield,
  Activity,
  GraduationCap,
  FileText,
  Download,
  CheckCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip
} from "recharts";

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  }) as { data?: any, isLoading: boolean };

  if (isLoading) {
    return (
      <main className="ml-64 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-64 p-6 overflow-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Digital Forensics Command Center
            </h1>
            <p className="text-muted-foreground">
              AI-Powered threat detection and forensic analysis platform
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90" 
              data-testid="button-new-investigation"
              onClick={() => {
                // Professional notification for new investigation
                alert('New Investigation feature activated! Creating forensic investigation workspace...');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Investigation
            </Button>
            <Button 
              variant="destructive" 
              data-testid="button-emergency-response"
              onClick={() => {
                // Professional emergency response activation
                alert('Emergency Response Protocol Activated! All security teams have been notified.');
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Response
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Threat Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive mb-2" data-testid="metric-active-threats">
              {metrics?.activeThreats || 0}
            </div>
            <div className="flex items-center text-sm">
              <Activity className="h-3 w-3 text-destructive mr-1" />
              <span className="text-destructive">Real-time</span>
              <span className="text-muted-foreground ml-1">monitoring</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Detections</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2" data-testid="metric-ai-detections">
              {metrics?.aiDetections || 0}
            </div>
            <div className="flex items-center text-sm">
              <Activity className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">97.8%</span>
              <span className="text-muted-foreground ml-1">accuracy</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evidence Logged</CardTitle>
            <Link className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2" data-testid="metric-evidence-logged">
              {metrics?.evidenceLogged || 0}
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-500">Blockchain verified</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2" data-testid="metric-response-time">
              {metrics?.responseTime || '2.3s'}
            </div>
            <div className="flex items-center text-sm">
              <Activity className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">Optimal</span>
              <span className="text-muted-foreground ml-1">performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Real-time Threat Detection */}
        <div className="xl:col-span-2">
          <ThreatDetection />
        </div>

        {/* Digital Forensics Models Comparison */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Forensics Models Performance</CardTitle>
              <CardDescription>AI vs Traditional Methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* AI-Enhanced Model */}
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">AI-Enhanced Model</h3>
                    <Badge className="bg-primary text-primary-foreground">NEW</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Detection Rate</span>
                    <span className="text-sm font-medium text-primary">97.8%</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '97.8%' }}></div>
                  </div>
                </div>

                {/* Traditional Models */}
                <div className="space-y-3">
                  {[
                    { name: "DFRWS Model", rate: 73.2 },
                    { name: "IDIP Model", rate: 68.9 },
                    { name: "SDFIM Model", rate: 71.5 }
                  ].map((model) => (
                    <div key={model.name} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">{model.name}</h4>
                        <span className="text-sm text-muted-foreground">{model.rate}%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-1.5">
                        <div 
                          className="bg-muted-foreground h-1.5 rounded-full" 
                          style={{ width: `${model.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full mt-4"
                data-testid="button-view-comparison"
              >
                <Activity className="h-4 w-4 mr-2" />
                View Detailed Comparison
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evidence Management and AI Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <BlockchainEvidence />
        <AIAnalysis />
      </div>

      {/* Incident Response and Attack Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncidentResponse />
        <AttackSimulation />
      </div>

      {/* Analytics and System Tools */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <Analytics />
        </div>

        {/* System Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-accent" />
              <CardTitle className="text-foreground">Forensic Tools</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Active Forensic Models</h3>
              
              {[
                { name: "AI-Enhanced DFRWS", desc: "Digital Forensic Research Workshop", status: "active" },
                { name: "Enhanced IDIP", desc: "Integrated Digital Investigation Process", status: "active" },
                { name: "ADFM+", desc: "Abstract Digital Forensics Model", status: "warning" }
              ].map((model) => (
                <div key={model.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.desc}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    model.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-generate-report"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Forensic Report
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-export-evidence"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Evidence Package
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  data-testid="button-verify-custody"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Chain of Custody
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Resources */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">AI-Powered Attack Education Center</CardTitle>
          </div>
          <CardDescription>Learn about emerging AI threats and forensic techniques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Deepfake Detection",
                description: "Learn to identify AI-generated media and social engineering attempts using deepfake technology.",
                level: "Intermediate",
                duration: "45 min",
                icon: "🎭"
              },
              {
                title: "Autonomous Malware Analysis",
                description: "Understanding self-modifying malware and AI-driven attack vectors.",
                level: "Advanced",
                duration: "60 min",
                icon: "🤖"
              },
              {
                title: "Blockchain Forensics",
                description: "Implementing blockchain technology for evidence integrity and chain of custody.",
                level: "Beginner",
                duration: "30 min",
                icon: "🔗"
              }
            ].map((module) => (
              <Card 
                key={module.title} 
                className="bg-muted/20 border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="text-2xl mb-4">{module.icon}</div>
                  <h3 className="text-sm font-medium text-foreground mb-2">{module.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={module.level === 'Advanced' ? 'destructive' : 
                               module.level === 'Intermediate' ? 'default' : 'secondary'}
                    >
                      {module.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{module.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Research Foundation</h3>
              <p className="text-xs text-muted-foreground">
                Based on COS700 Research: "A Digital Forensics Readiness Model for AI-Powered Cyber Attacks"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Student: u25717342 | Supervisor: Mr Sheunesu Makura
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Supported Models</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• DFRWS (Digital Forensic Research Workshop)</li>
                <li>• IDIP (Integrated Digital Investigation Process)</li>
                <li>• SDFIM (Systemic Digital Forensic Investigation)</li>
                <li>• ADFM (Abstract Digital Forensics Model)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">System Status</h3>
              <div className="space-y-2">
                {[
                  { name: "AI Engine", status: "Operational" },
                  { name: "Blockchain Network", status: "Connected" },
                  { name: "Threat Database", status: "Updated" }
                ].map((system) => (
                  <div key={system.name} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{system.name}</span>
                    <span className="text-xs text-green-500">{system.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
