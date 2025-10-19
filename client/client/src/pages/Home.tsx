import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import ThreatDetection from "@/components/ThreatDetection";
import BlockchainEvidence from "@/components/BlockchainEvidence";
import IncidentResponse from "@/components/IncidentResponse";
import AttackSimulation from "@/components/AttackSimulation";
import Analytics from "@/components/Analytics";
import Reports from "@/components/Reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, BarChart3, FolderOpen } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen matrix-bg bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forensics platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Dashboard />;
      case "threat-detection":
        return (
          <main className="ml-64 p-6">
            <ThreatDetection />
          </main>
        );
      case "ai-analysis":
        return (
          <main className="ml-64 p-6">
            <Analytics />
          </main>
        );
      case "blockchain":
        return (
          <main className="ml-64 p-6">
            <BlockchainEvidence />
          </main>
        );
      case "pattern-analysis":
        return (
          <main className="ml-64 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Pattern Analysis</h1>
                  <p className="text-muted-foreground">Advanced AI pattern recognition and threat correlation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Analytics />
                <ThreatDetection />
              </div>
            </div>
          </main>
        );
      case "case-management":
        return (
          <main className="ml-64 p-6">
            <IncidentResponse />
          </main>
        );
      case "simulation":
        return (
          <main className="ml-64 p-6">
            <AttackSimulation />
          </main>
        );
      case "reports":
        return (
          <main className="ml-64 p-6">
            <Reports />
          </main>
        );
      case "users":
        return (
          <main className="ml-64 p-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage system users, roles, and permissions</p>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Active Users: 23</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 5 Administrators</li>
                    <li>• 12 Forensic Analysts</li>
                    <li>• 6 Security Operators</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </main>
        );
      case "settings":
        return (
          <main className="ml-64 p-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Configure system parameters and security settings</p>
                <div className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Detection Sensitivity: High</h3>
                    <p className="text-sm text-muted-foreground">AI models configured for maximum threat detection</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Blockchain Network: Active</h3>
                    <p className="text-sm text-muted-foreground">Evidence logging nodes operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen matrix-bg bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
