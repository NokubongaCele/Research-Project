import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Radar, Worm, Mail, Bot, TestTube, Search, Network, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Threat } from "@shared/schema";

export default function ThreatDetection() {
  const [liveThreats, setLiveThreats] = useState<Threat[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [testNetwork, setTestNetwork] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: threats, isLoading } = useQuery({
    queryKey: ["/api/threats"],
    refetchInterval: 10000, // Refresh every 10 seconds
  }) as { data?: Threat[], isLoading: boolean };

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected for threat detection');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'threat_detected') {
          setLiveThreats(prev => [message.data, ...prev.slice(0, 4)]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deepfake':
        return <Worm className="h-4 w-4 text-destructive" />;
      case 'autonomous_malware':
        return <Bot className="h-4 w-4 text-yellow-500" />;
      case 'ai_phishing':
        return <Mail className="h-4 w-4 text-primary" />;
      case 'network_intrusion':
        return <Network className="h-4 w-4 text-orange-500" />;
      default:
        return <Radar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const displayThreats = liveThreats.length > 0 ? liveThreats : (Array.isArray(threats) ? threats.slice(0, 5) : []);

  const scanEmailMutation = useMutation({
    mutationFn: async (emailText: string) => {
      const response = await apiRequest("POST", "/api/threats/scan-email", { emailText, source: "Email Analysis" });
      return await response.json();
    },
    onSuccess: (result: any) => {
      if (result?.threat) {
        const confidence = result?.prediction?.confidence ? Math.round(result.prediction.confidence * 100) : 0;
        toast({
          title: "Threat Detected!",
          description: `Phishing email detected with ${confidence}% confidence`,
          variant: "destructive"
        });
        // Refresh threats list
        queryClient.invalidateQueries({ queryKey: ["/api/threats"] });
      } else {
        const confidence = result?.prediction?.confidence ? Math.round(result.prediction.confidence * 100) : 0;
        toast({
          title: "Email Analysis Complete",
          description: `No threats detected. Confidence: ${confidence}%`
        });
      }
      setTestEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze email",
        variant: "destructive"
      });
    }
  });

  const predictOnlyMutation = useMutation({
    mutationFn: async (emailText: string) => {
      const response = await apiRequest("POST", "/api/ml/phishing/predict", { emailText });
      return await response.json();
    },
    onSuccess: (result: any) => {
      const confidence = result?.prediction?.confidence ? Math.round(result.prediction.confidence * 100) : 0;
      const label = result?.prediction?.label || 'Unknown';
      const isPhishing = result?.prediction?.isPhishing || false;
      
      toast({
        title: "Phishing Analysis Complete",
        description: `${label} - Confidence: ${confidence}%`,
        variant: isPhishing ? "destructive" : "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze email",
        variant: "destructive"
      });
    }
  });

  const scanNetworkMutation = useMutation({
    mutationFn: async (networkData: string) => {
      const response = await apiRequest("POST", "/api/threats/scan-network", { networkData, source: "Network Analysis" });
      return await response.json();
    },
    onSuccess: (result: any) => {
      if (result?.threat) {
        const confidence = result?.prediction?.confidence ? Math.round(result.prediction.confidence * 100) : 0;
        const attackType = result?.prediction?.attackType || 'Unknown attack';
        toast({
          title: "Network Threat Detected!",
          description: `${attackType} detected with ${confidence}% confidence`,
          variant: "destructive"
        });
        // Refresh threats list
        queryClient.invalidateQueries({ queryKey: ["/api/threats"] });
      } else {
        const confidence = result?.prediction?.confidence ? Math.round(result.prediction.confidence * 100) : 0;
        toast({
          title: "Network Analysis Complete",
          description: `Traffic appears normal. Confidence: ${confidence}%`
        });
      }
      setTestNetwork("");
    },
    onError: (error: any) => {
      toast({
        title: "Network Analysis Failed",
        description: error.message || "Failed to analyze network traffic",
        variant: "destructive"
      });
    }
  });

  const predictNetworkMutation = useMutation({
    mutationFn: async (networkData: string) => {
      const response = await apiRequest("POST", "/api/ml/network/predict", { networkData });
      return await response.json();
    },
    onSuccess: (result: any) => {
      const confidence = Math.round(result.prediction.confidence * 100);
      const attackType = result.prediction.attackType;
      const status = result.modelStatus === 'ready' ? 'AI Model' : 'Simulated';
      
      toast({
        title: `Network Analysis Result (${status})`,
        description: `${attackType} - Confidence: ${confidence}%`,
        variant: result.prediction.isAttack ? "destructive" : "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Network Analysis Failed",
        description: error.message || "Failed to analyze network traffic",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Real-time Threat Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Real-time Threat Detection</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Monitoring</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Threat Detection Visualization */}
        <div className="relative h-64 bg-muted/20 rounded-lg mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Radar className="h-16 w-16 text-primary mb-4 threat-pulse mx-auto" />
              <p className="text-muted-foreground">AI Threat Scanner Active</p>
              <div className="mt-4 space-y-2">
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary scan-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Detections */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Recent AI-Powered Attack Attempts
          </h3>
          
          {displayThreats.length === 0 ? (
            <Alert>
              <Radar className="h-4 w-4" />
              <AlertDescription>
                No threats detected. System monitoring is active.
              </AlertDescription>
            </Alert>
          ) : (
            displayThreats.map((threat: Threat) => (
              <div 
                key={threat.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                data-testid={`threat-${threat.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
                    {getIcon(threat.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {threat.type === 'deepfake' && 'Deepfake Phishing Detected'}
                      {threat.type === 'autonomous_malware' && 'Autonomous Malware Activity'}
                      {threat.type === 'ai_phishing' && 'AI-Generated Spear Phishing'}
                      {threat.type === 'network_intrusion' && 'Network Intrusion Detected'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {threat.source && `Source: ${threat.source} • `}
                      {threat.createdAt ? new Date(threat.createdAt).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
                <Badge variant={getSeverityColor(threat.severity) as any}>
                  {threat.severity}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>

    {/* Email Analysis Testing */}
    <Card className="bg-card border-border mt-6">
      <CardHeader className="border-b border-border">
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Email Threat Analysis</CardTitle>
        </div>
        <CardDescription>
          Test email content against AI-powered phishing detection models
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste email content here for AI analysis..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="min-h-32 bg-background border-border"
            data-testid="input-email-text"
          />
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => predictOnlyMutation.mutate(testEmail)}
              disabled={!testEmail.trim() || predictOnlyMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2"
              data-testid="button-analyze-email"
            >
              <Search className="h-4 w-4" />
              <span>
                {predictOnlyMutation.isPending ? "Analyzing..." : "Analyze Only"}
              </span>
            </Button>
            
            <Button 
              onClick={() => scanEmailMutation.mutate(testEmail)}
              disabled={!testEmail.trim() || scanEmailMutation.isPending}
              className="flex items-center space-x-2"
              data-testid="button-scan-email"
            >
              <Radar className="h-4 w-4" />
              <span>
                {scanEmailMutation.isPending ? "Scanning..." : "Scan & Create Threat"}
              </span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <strong>Analyze Only:</strong> Check threat level without creating database entries. 
            <strong> Scan & Create Threat:</strong> Analyze and automatically log high-confidence threats.
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Network Traffic Analysis Testing */}
    <Card className="bg-card border-border mt-6">
      <CardHeader className="border-b border-border">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-foreground">Network Intrusion Analysis</CardTitle>
        </div>
        <CardDescription>
          Test network traffic data against AI-powered intrusion detection models
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Network Traffic Data</label>
            <Textarea
              placeholder="Paste network connection data here (CSV format or JSON)...
Example: 0,tcp,http,SF,181,5450,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,8,8,0.0,0.0,0.0,0.0,1.0,0.0,0.0,9,9,1.0,0.05,0.00,0.0,0.0,0.0,0.0,0.0"
              value={testNetwork}
              onChange={(e) => setTestNetwork(e.target.value)}
              className="min-h-32 bg-background border-border text-sm font-mono"
              data-testid="input-network-data"
            />
            <div className="text-xs text-muted-foreground">
              Supports NSL-KDD format: duration,protocol_type,service,flag,src_bytes,dst_bytes,... 
              or JSON with network features
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => predictNetworkMutation.mutate(testNetwork)}
              disabled={!testNetwork.trim() || predictNetworkMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2"
              data-testid="button-analyze-network"
            >
              <Search className="h-4 w-4" />
              <span>
                {predictNetworkMutation.isPending ? "Analyzing..." : "Analyze Only"}
              </span>
            </Button>
            
            <Button 
              onClick={() => scanNetworkMutation.mutate(testNetwork)}
              disabled={!testNetwork.trim() || scanNetworkMutation.isPending}
              className="flex items-center space-x-2"
              data-testid="button-scan-network"
            >
              <Network className="h-4 w-4" />
              <span>
                {scanNetworkMutation.isPending ? "Scanning..." : "Scan & Create Threat"}
              </span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <strong>Analyze Only:</strong> Check for intrusions without creating database entries. 
            <strong> Scan & Create Threat:</strong> Analyze and automatically log high-confidence threats.
          </div>

          {/* Sample Data Helper */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Sample Attack Data:</p>
            <div className="space-y-1 text-xs font-mono">
              <button 
                onClick={() => setTestNetwork("0,tcp,private,S0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,511,23,1.0,1.0,0.0,0.0,0.05,0.05,0.0,255,23,0.09,0.05,0.0,0.0,1.0,1.0,0.0,0.0")}
                className="block w-full text-left p-1 hover:bg-muted/50 rounded text-muted-foreground"
                data-testid="button-sample-neptune"
              >
                <span className="text-orange-500">Neptune (SYN Flood):</span> High connection count, S0 flag
              </button>
              <button 
                onClick={() => setTestNetwork("0,icmp,eco_i,SF,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,44,0.0,0.0,0.0,0.0,1.0,0.0,1.0,1,95,1.0,0.0,1.0,0.51,0.0,0.0,0.0,0.0")}
                className="block w-full text-left p-1 hover:bg-muted/50 rounded text-muted-foreground"
                data-testid="button-sample-ipsweep"
              >
                <span className="text-red-500">IP Sweep:</span> ICMP echo requests to multiple hosts
              </button>
              <button 
                onClick={() => setTestNetwork("0,tcp,http,SF,215,45076,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,10,10,0.0,0.0,0.0,0.0,1.0,0.0,0.0,255,255,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0")}
                className="block w-full text-left p-1 hover:bg-muted/50 rounded text-muted-foreground"
                data-testid="button-sample-normal"
              >
                <span className="text-green-500">Normal Traffic:</span> Regular HTTP connection
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
  );
}
