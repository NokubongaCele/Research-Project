import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AlertTriangle, Plus, Search, ArrowUp } from "lucide-react";
import type { Incident } from "@shared/schema";

export default function IncidentResponse() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["/api/incidents"],
    refetchInterval: 30000,
  }) as { data?: Incident[], isLoading: boolean };

  const createIncidentMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; severity: string }) => {
      await apiRequest("POST", "/api/incidents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Success",
        description: "Incident created successfully",
      });
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setSeverity("medium");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create incident",
        variant: "destructive",
      });
    },
  });

  const updateIncidentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Incident> }) => {
      await apiRequest("PATCH", `/api/incidents/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Success",
        description: "Incident updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update incident",
        variant: "destructive",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-destructive';
      case 'investigating':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-muted-foreground';
      default:
        return 'bg-muted-foreground';
    }
  };

  const handleSubmit = () => {
    // Professional validation for incident creation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an incident title.",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an incident description.",
        variant: "destructive",
      });
      return;
    }
    
    if (description.trim().length < 15) {
      toast({
        title: "Validation Error",
        description: "Incident description must be at least 15 characters for proper documentation.",
        variant: "destructive",
      });
      return;
    }
    
    createIncidentMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      severity,
    });
  };

  const activeIncidents = Array.isArray(incidents) ? incidents.filter((i: Incident) => i.status === 'open' || i.status === 'investigating') : [];
  const criticalIncidents = activeIncidents.filter((i: Incident) => i.severity === 'critical').length;

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Active Incidents</CardTitle>
          </div>
          {criticalIncidents > 0 && (
            <Badge variant="destructive" data-testid="critical-incidents-count">
              {criticalIncidents} Critical
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          {activeIncidents.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active incidents</p>
            </div>
          ) : (
            activeIncidents.slice(0, 3).map((incident: Incident) => (
              <div 
                key={incident.id} 
                className="border border-border rounded-lg p-4"
                data-testid={`incident-${incident.id || 'unknown'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusIndicator(incident.status)}`}></div>
                    <h3 className="text-sm font-medium text-foreground">
                      INC-{incident.id ? incident.id.slice(-6).toUpperCase() : 'UNKNOWN'}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : 'Unknown'}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-2">{incident.title}</p>
                <div className="flex items-center justify-between">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  {incident.assignedTo && (
                    <span className="text-xs text-muted-foreground">
                      Analyst: <span className="text-foreground">{String(incident.assignedTo)}</span>
                    </span>
                  )}
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button 
                    size="sm"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => updateIncidentMutation.mutate({
                      id: incident.id,
                      updates: { status: 'investigating' }
                    })}
                    disabled={updateIncidentMutation.isPending}
                    data-testid={`investigate-incident-${incident.id}`}
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Investigate
                  </Button>
                  <Button 
                    size="sm"
                    variant="secondary"
                    onClick={() => updateIncidentMutation.mutate({
                      id: incident.id,
                      updates: { severity: 'critical' }
                    })}
                    disabled={updateIncidentMutation.isPending}
                    data-testid={`escalate-incident-${incident.id}`}
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-create-incident"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Incident</DialogTitle>
              <DialogDescription>
                Log a new security incident for investigation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Incident Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-input border-border"
                  data-testid="input-incident-title"
                />
              </div>
              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="bg-input border-border" data-testid="select-incident-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the incident..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-input border-border"
                  data-testid="textarea-incident-description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-incident"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!title.trim() || !description.trim() || createIncidentMutation.isPending}
                  data-testid="button-submit-incident"
                >
                  {createIncidentMutation.isPending ? "Creating..." : "Create Incident"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
