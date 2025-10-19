import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { TestTube, Play, Zap, Shield, Worm, Mail, Bot } from "lucide-react";
import type { Simulation } from "@shared/schema";

export default function AttackSimulation() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [simulationType, setSimulationType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: simulations, isLoading } = useQuery({
    queryKey: ["/api/simulations"],
    refetchInterval: 30000,
  }) as { data?: Simulation[], isLoading: boolean };

  const createSimulationMutation = useMutation({
    mutationFn: async (data: { type: string; name: string; description: string }) => {
      await apiRequest("POST", "/api/simulations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulations"] });
      toast({
        title: "Success",
        description: "Simulation started successfully",
      });
      setIsDialogOpen(false);
      setSimulationType("");
      setName("");
      setDescription("");
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
        description: "Failed to start simulation",
        variant: "destructive",
      });
    },
  });

  const runSimulationMutation = useMutation({
    mutationFn: async (data: { type: string; name: string }) => {
      await apiRequest("POST", "/api/simulations", {
        type: data.type,
        name: data.name,
        description: `Automated ${data.name} simulation test`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulations"] });
      toast({
        title: "Success",
        description: "Simulation test started",
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
        description: "Failed to start simulation",
        variant: "destructive",
      });
    },
  });

  const completedSimulations = Array.isArray(simulations) ? simulations.filter((s: Simulation) => s.status === 'completed') : [];
  const averageDetectionRate = completedSimulations.length > 0
    ? (completedSimulations.reduce((acc: number, s: Simulation) => acc + (s.detectionRate || 0), 0) / completedSimulations.length * 100).toFixed(1)
    : "0";

  const simulationTypes = [
    {
      type: 'deepfake',
      name: 'Deepfake Attack',
      icon: Worm,
      color: 'text-destructive',
      description: 'Test detection of AI-generated deepfake content and social engineering'
    },
    {
      type: 'autonomous_malware',
      name: 'Autonomous Malware',
      icon: Bot,
      color: 'text-yellow-500',
      description: 'Simulate self-modifying malware with adaptive behaviors'
    },
    {
      type: 'ai_phishing',
      name: 'AI Phishing Campaign',
      icon: Mail,
      color: 'text-orange-500',
      description: 'Test against AI-generated spear phishing attacks'
    }
  ];

  const handleSubmit = () => {
    // Professional validation for simulation creation
    if (!simulationType) {
      toast({
        title: "Validation Error",
        description: "Please select a simulation type.",
        variant: "destructive",
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a simulation name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please provide a simulation description.",
        variant: "destructive",
      });
      return;
    }
    
    if (description.trim().length < 15) {
      toast({
        title: "Validation Error",
        description: "Simulation description must be at least 15 characters for proper documentation.",
        variant: "destructive",
      });
      return;
    }
    
    createSimulationMutation.mutate({
      type: simulationType,
      name: name.trim(),
      description: description.trim(),
    });
  };

  const runQuickTest = (type: string, name: string) => {
    runSimulationMutation.mutate({ type, name });
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Attack Simulation Lab</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
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
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center space-x-3">
          <TestTube className="h-5 w-5 text-accent" />
          <CardTitle className="text-foreground">Attack Simulation Lab</CardTitle>
        </div>
        <CardDescription>Test and validate forensic readiness</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1" data-testid="simulations-completed">
              {completedSimulations.length}
            </div>
            <div className="text-xs text-muted-foreground">Simulations Run</div>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1" data-testid="detection-rate">
              {averageDetectionRate}%
            </div>
            <div className="text-xs text-muted-foreground">Detection Rate</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-foreground">Available Simulations</h3>
          {simulationTypes.map((sim) => (
            <div 
              key={sim.type} 
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                <sim.icon className={`h-5 w-5 ${sim.color}`} />
                <span className="text-sm text-foreground">{sim.name}</span>
              </div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => runQuickTest(sim.type, sim.name)}
                disabled={runSimulationMutation.isPending}
                data-testid={`run-test-${sim.type}`}
              >
                <Play className="h-3 w-3 mr-1" />
                Run Test
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-start-comprehensive-test"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Comprehensive Test Suite
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create Custom Simulation</DialogTitle>
                <DialogDescription>
                  Design a custom attack simulation to test specific forensic capabilities
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="simulationType">Simulation Type</Label>
                  <Select value={simulationType} onValueChange={setSimulationType}>
                    <SelectTrigger className="bg-input border-border" data-testid="select-simulation-type">
                      <SelectValue placeholder="Select attack type" />
                    </SelectTrigger>
                    <SelectContent>
                      {simulationTypes.map((sim) => (
                        <SelectItem key={sim.type} value={sim.type}>
                          {sim.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Simulation Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter simulation name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                    data-testid="input-simulation-name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the simulation scenario..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-input border-border"
                    data-testid="textarea-simulation-description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-simulation"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!simulationType || !name.trim() || !description.trim() || createSimulationMutation.isPending}
                    data-testid="button-submit-simulation"
                  >
                    {createSimulationMutation.isPending ? "Starting..." : "Start Simulation"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Simulations */}
        {Array.isArray(simulations) && simulations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Recent Simulations</h3>
            <div className="space-y-2">
              {simulations.slice(0, 3).map((simulation: Simulation) => (
                <div 
                  key={simulation.id}
                  className="flex items-center justify-between p-2 bg-muted/10 rounded text-xs"
                  data-testid={`simulation-${simulation.id}`}
                >
                  <span className="text-foreground">{simulation.name}</span>
                  <div className="flex items-center space-x-2">
                    {simulation.detectionRate && (
                      <span className="text-green-500">
                        {(simulation.detectionRate * 100).toFixed(1)}%
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded ${
                      simulation.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                      simulation.status === 'running' ? 'bg-primary/20 text-primary' :
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {simulation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
