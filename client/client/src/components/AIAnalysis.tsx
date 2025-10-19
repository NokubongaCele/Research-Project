import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Lightbulb, AlertTriangle } from "lucide-react";

export default function AIAnalysis() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const aiMetrics = [
    { name: "Anomaly Detection", value: 94.3, color: "text-green-500", bgColor: "bg-green-500" },
    { name: "Pattern Recognition", value: 87.9, color: "text-primary", bgColor: "bg-primary" },
    { name: "Predictive Analysis", value: 91.7, color: "text-accent", bgColor: "bg-accent" }
  ];

  const aiInsights = [
    {
      type: "info",
      title: "New Attack Vector Identified",
      description: "ML model detected unusual email pattern suggesting AI-generated content",
      icon: Lightbulb,
      iconColor: "text-primary"
    },
    {
      type: "warning", 
      title: "Behavioral Anomaly",
      description: "Autonomous malware exhibiting self-modification capabilities",
      icon: AlertTriangle,
      iconColor: "text-yellow-500"
    }
  ];

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="border-b border-border">
        <div className="flex items-center space-x-3">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">AI Pattern Analysis</CardTitle>
        </div>
        <CardDescription>Machine learning threat intelligence</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* AI Analysis Metrics */}
        <div className="space-y-6 mb-6">
          {aiMetrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.name}</span>
                <span className={`text-sm font-medium ${metric.color}`}>
                  {metric.value}%
                </span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2" 
                data-testid={`progress-${metric.name.toLowerCase().replace(' ', '-')}`}
              />
            </div>
          ))}
        </div>

        {/* Recent AI Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground mb-3">AI Insights</h3>
          {aiInsights.map((insight, index) => (
            <Alert 
              key={index}
              className={
                insight.type === 'warning' 
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : "bg-primary/10 border-primary/30"
              }
            >
              <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
              <div>
                <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                <AlertDescription className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>

        {/* AI Performance Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">97.8%</div>
            <div className="text-xs text-muted-foreground">Overall AI Accuracy</div>
            <div className="text-xs text-green-500 mt-1">+15% improvement this month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
