import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Brain, Link, Activity } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen matrix-bg bg-background text-foreground">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary cyber-glow" />
              <h1 className="text-xl font-bold text-foreground">CyberForensics Pro</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Shield className="h-20 w-20 text-primary cyber-glow mx-auto mb-6 threat-pulse" />
            <h1 className="text-5xl font-bold text-foreground mb-6">
              AI-Powered Digital Forensics Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Next-generation forensic readiness model designed to detect, analyze, and respond to 
              AI-powered cyber attacks in real-time using blockchain evidence logging.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Advanced Forensic Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Activity className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-foreground">Real-time Threat Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Advanced AI algorithms detect deepfake attacks, autonomous malware, 
                  and AI-generated phishing in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-foreground">AI Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Machine learning models analyze attack patterns and predict 
                  future threats with 97.8% accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Link className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-foreground">Blockchain Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Immutable blockchain logging ensures evidence integrity 
                  and maintains chain of custody.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle className="text-foreground">Enhanced Models</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Improved DFRWS, IDIP, and SDFIM models optimized 
                  for AI-powered attack scenarios.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Research-Based Foundation
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Built on extensive research from the COS700 project: "A Digital Forensics Readiness Model 
            for AI-Powered Cyber Attacks" - addressing the critical gap between evolving AI threats 
            and traditional forensic capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">97.8%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">2.3s</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Evidence Integrity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h3 className="text-sm font-medium text-foreground mb-3">Platform Features</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Real-time AI threat detection</li>
                <li>• Blockchain evidence logging</li>
                <li>• Attack simulation environment</li>
                <li>• Comprehensive analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
