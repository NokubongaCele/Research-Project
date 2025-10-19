import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link, Plus, CheckCircle } from "lucide-react";
import type { Evidence } from "@shared/schema";

export default function BlockchainEvidence() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [threatId, setThreatId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: evidence, isLoading } = useQuery({
    queryKey: ["/api/evidence"],
    refetchInterval: 30000,
  }) as { data?: Evidence[], isLoading: boolean };

  const addEvidenceMutation = useMutation({
    mutationFn: async (data: { description: string; threatId?: string }) => {
      await apiRequest("POST", "/api/evidence", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidence"] });
      toast({
        title: "Success",
        description: "Evidence added to blockchain",
      });
      setIsDialogOpen(false);
      setDescription("");
      setThreatId("");
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
        description: "Failed to add evidence",
        variant: "destructive",
      });
    },
  });

  const verifyEvidenceMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await apiRequest("PATCH", `/api/evidence/${id}/verify`, {});
      return result;
    },
    onSuccess: async () => {
      // Force immediate cache refresh to update UI state
      await queryClient.invalidateQueries({ queryKey: ["/api/evidence"] });
      await queryClient.refetchQueries({ queryKey: ["/api/evidence"] });
      toast({
        title: "Success",
        description: "Evidence verified on blockchain",
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
        description: "Failed to verify evidence",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    // Professional validation
    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a detailed evidence description for forensic integrity.",
        variant: "destructive",
      });
      return;
    }
    
    if (description.trim().length < 10) {
      toast({
        title: "Validation Error", 
        description: "Evidence description must be at least 10 characters for proper documentation.",
        variant: "destructive",
      });
      return;
    }
    
    addEvidenceMutation.mutate({
      description: description.trim(),
      threatId: threatId || undefined,
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Blockchain Evidence Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center space-x-3">
          <Link className="h-5 w-5 text-accent" />
          <CardTitle className="text-foreground">Blockchain Evidence Chain</CardTitle>
        </div>
        <CardDescription>Immutable evidence logging and verification</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          {Array.isArray(evidence) ? evidence.slice(0, 3).map((item: Evidence) => (
            <div 
              key={item.id} 
              className={`flex items-center space-x-4 p-4 rounded-lg border ${
                item.verified 
                  ? "bg-muted/20 border-border" 
                  : "bg-primary/10 border-primary/30"
              }`}
              data-testid={`evidence-${item.id}`}
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Link className={`h-6 w-6 ${item.verified ? 'text-accent' : 'text-primary animate-pulse'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    Block #{item.blockHash?.slice(-4)}
                  </h4>
                  <Badge 
                    variant={item.verified ? "default" : "secondary"}
                    className={item.verified ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"}
                  >
                    {item.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Hash: {item.blockHash}</p>
                <p className="text-xs text-muted-foreground">Evidence: {item.description}</p>
                {!item.verified && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => verifyEvidenceMutation.mutate(item.id)}
                    disabled={verifyEvidenceMutation.isPending}
                    data-testid={`verify-evidence-${item.id}`}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verify
                  </Button>
                )}
              </div>
            </div>
          )) : []}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-add-evidence"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Evidence to Chain
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Evidence to Blockchain</DialogTitle>
              <DialogDescription>
                Create an immutable record of forensic evidence
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="threatId">Related Threat ID (Optional)</Label>
                <Input
                  id="threatId"
                  placeholder="Enter threat ID if related"
                  value={threatId}
                  onChange={(e) => setThreatId(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="description">Evidence Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the evidence being logged..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-input border-border"
                  data-testid="textarea-evidence-description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-evidence"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!description.trim() || addEvidenceMutation.isPending}
                  data-testid="button-submit-evidence"
                >
                  {addEvidenceMutation.isPending ? "Adding..." : "Add to Chain"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
