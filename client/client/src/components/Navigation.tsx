import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Search, 
  Brain, 
  Link, 
  BarChart3, 
  FolderOpen,
  TestTube,
  Users,
  Settings,
  Bell,
  LogOut,
  FileText,
  Download
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const { user } = useAuth() as { user?: User };
  const { toast } = useToast();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3, active: true },
    { id: "threat-detection", label: "Threat Detection", icon: Search },
    { id: "ai-analysis", label: "AI Analysis", icon: Brain },
    { id: "blockchain", label: "Blockchain Evidence", icon: Link },
    { id: "pattern-analysis", label: "Pattern Analysis", icon: BarChart3 },
    { id: "case-management", label: "Case Management", icon: FolderOpen },
    { id: "simulation", label: "Attack Simulation", icon: TestTube },
    { id: "reports", label: "Forensic Reports", icon: Download },
    { id: "users", label: "User Management", icon: Users },
    { id: "logs", label: "System Logs", icon: FileText },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary cyber-glow" />
                <h1 className="text-xl font-bold text-foreground">CyberForensics Pro</h1>
              </div>
              <Badge variant="secondary" className="hidden md:inline-block">
                AI-Powered Digital Forensics
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-testid="status-indicator"></div>
                <span className="text-sm text-muted-foreground">System Status: Active</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 relative" 
                  data-testid="button-notifications"
                  onClick={() => {
                    toast({
                      title: "Security Notifications",
                      description: "🔴 2 Critical threats detected\n🟡 1 Evidence verification pending\n🟢 System health check complete",
                    });
                  }}
                >
                  <Bell className="h-5 w-5 text-primary" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium" data-testid="user-avatar">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium" data-testid="user-name">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.email || 'User'}
                  </span>
                  <Badge variant="outline" className="hidden md:block" data-testid="user-role">
                    {user?.role || 'Analyst'}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-64 bg-card border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Main Dashboard
            </h2>
            <ul className="space-y-1">
              {navItems.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      toast({
                        title: "Navigation",
                        description: `Switched to ${item.label}`,
                      });
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Forensics Tools
            </h2>
            <ul className="space-y-1">
              {navItems.slice(3, 6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      toast({
                        title: "Forensics Tool",
                        description: `Accessing ${item.label}`,
                      });
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Security Center
            </h2>
            <ul className="space-y-1">
              {navItems.slice(6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      toast({
                        title: "Security Center",
                        description: `Opening ${item.label}`,
                      });
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
