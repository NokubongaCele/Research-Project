Theimport { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Filter, 
  Search, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  XCircle,
  Clock,
  Shield,
  User,
  Settings
} from "lucide-react";

export default function SystemLogs() {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // Mock logs data since we don't have the API endpoint yet
  const mockLogs = [
    {
      id: '1',
      level: 'critical',
      category: 'security',
      event: 'AI-powered attack detected',
      description: 'Advanced deepfake attack blocked by AI detection system with 94% confidence',
      timestamp: new Date().toISOString(),
      metadata: JSON.stringify({ source: 'threat_detection', confidence: 0.94, attack_type: 'deepfake' })
    },
    {
      id: '2',
      level: 'warning',
      category: 'forensic',
      event: 'Evidence verification initiated',
      description: 'Blockchain evidence verification process started for incident investigation',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      metadata: JSON.stringify({ block_hash: 'blk_1a2b3c4d', incident_id: '46936410-171d-49ba-9b3b-356a2eaf56bd' })
    },
    {
      id: '3',
      level: 'info',
      category: 'user',
      event: 'User authentication success',
      description: 'Forensic analyst logged in successfully',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      metadata: JSON.stringify({ user_id: 'user_123', role: 'analyst' })
    },
    {
      id: '4',
      level: 'error',
      category: 'security',
      event: 'Intrusion attempt blocked',
      description: 'Multiple failed authentication attempts detected and blocked',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      metadata: JSON.stringify({ source_ip: '192.168.1.100', attempts: 5, blocked: true })
    },
    {
      id: '5',
      level: 'info',
      category: 'forensic',
      event: 'Case evidence logged',
      description: 'New forensic evidence added to active investigation case',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      metadata: JSON.stringify({ case_id: 'case_123', evidence_type: 'network_analysis', verified: true })
    },
    {
      id: '6',
      level: 'warning',
      category: 'system',
      event: 'AI model retrained',
      description: 'Threat detection AI model updated with new attack patterns',
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      metadata: JSON.stringify({ model_version: '2.4.1', accuracy_improvement: '3.2%' })
    }
  ];

  const { data: logs = mockLogs, isLoading, refetch } = useQuery({
    queryKey: ["/api/logs", categoryFilter, levelFilter],
    initialData: mockLogs,
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds if enabled
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || log.category === categoryFilter;
    const matchesLevel = levelFilter === "" || log.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4 text-red-500" />;
      case 'forensic': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'user': return <User className="h-4 w-4 text-blue-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'error': return 'bg-red-400 text-white';
      case 'warning': return 'bg-yellow-500 text-black';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleExportLogs = () => {
    toast({
      title: "Export Started",
      description: "Preparing logs export file...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Logs exported successfully to forensic_logs.csv",
      });
    }, 2000);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "System logs updated",
    });
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setLevelFilter("");
    setSearchQuery("");
    toast({
      title: "Filters Cleared",
      description: "All log filters have been reset",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">System Activity Logs</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              data-testid="button-refresh-logs"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogs}
              data-testid="button-export-logs"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-logs"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger data-testid="select-category-filter">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="forensic">Forensic</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger data-testid="select-level-filter">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center"
            data-testid="button-clear-filters"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Auto-refresh:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAutoRefresh(!autoRefresh);
                toast({
                  title: autoRefresh ? "Auto-refresh Disabled" : "Auto-refresh Enabled",
                  description: autoRefresh ? "Logs will not update automatically" : "Logs will update every 10 seconds",
                });
              }}
              className={autoRefresh ? "bg-primary text-primary-foreground" : ""}
              data-testid="button-auto-refresh"
            >
              {autoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {/* Logs List */}
        <ScrollArea className="h-96 w-full">
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid={`log-entry-${log.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getLevelIcon(log.level)}
                    {getCategoryIcon(log.category)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{log.event}</h4>
                        <Badge className={`text-xs ${getLevelBadgeColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
                
                {log.metadata && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                    <details>
                      <summary className="cursor-pointer hover:text-foreground">
                        View Metadata
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}