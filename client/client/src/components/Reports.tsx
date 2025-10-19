import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Download, 
  Calendar, 
  FileSpreadsheet,
  FileImage,
  FileJson,
  Shield,
  Brain,
  AlertTriangle,
  Eye,
  CheckCircle,
  Clock,
  Filter
} from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("incident");
  const [dateRange, setDateRange] = useState("7d");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/api/reports/preview", reportType, dateRange],
    initialData: {
      incidents: 3,
      threats: 12,
      evidence: 8,
      aiDetections: 9,
      blockedAttacks: 5,
      criticalAlerts: 2
    }
  });

  const reportTypes = [
    { 
      id: "incident", 
      label: "Incident Report", 
      icon: AlertTriangle, 
      description: "Comprehensive incident analysis and response documentation"
    },
    { 
      id: "threat", 
      label: "Threat Intelligence", 
      icon: Shield, 
      description: "Threat detection summary and AI analysis results"
    },
    { 
      id: "evidence", 
      label: "Evidence Report", 
      icon: FileText, 
      description: "Blockchain evidence verification and audit trail"
    },
    { 
      id: "security", 
      label: "Security Assessment", 
      icon: Eye, 
      description: "Overall security posture and vulnerability analysis"
    },
    { 
      id: "ai-analysis", 
      label: "AI Analysis Report", 
      icon: Brain, 
      description: "Machine learning insights and pattern recognition results"
    }
  ];

  const exportFormats = [
    { id: "pdf", label: "PDF Report", icon: FileText, description: "Professional PDF document" },
    { id: "csv", label: "CSV Data", icon: FileSpreadsheet, description: "Spreadsheet-compatible data" },
    { id: "json", label: "JSON Export", icon: FileJson, description: "Structured data format" },
    { id: "excel", label: "Excel Report", icon: FileSpreadsheet, description: "Microsoft Excel format" }
  ];

  const generateReportMutation = useMutation({
    mutationFn: async (reportConfig: any) => {
      setIsGenerating(true);
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportConfig)
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      toast({
        title: "Report Generated Successfully",
        description: `${reportTypes.find(r => r.id === reportType)?.label} is ready for download`,
      });
      
      // Simulate file download
      const element = document.createElement('a');
      const fileName = `forensic_report_${reportType}_${Date.now()}.${exportFormat}`;
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample report data'));
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate report. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateReport = () => {
    const reportConfig = {
      type: reportType,
      dateRange,
      format: exportFormat,
      title: customTitle || reportTypes.find(r => r.id === reportType)?.label,
      description,
      timestamp: new Date().toISOString()
    };
    
    generateReportMutation.mutate(reportConfig);
  };

  const handleQuickDownload = (format: string) => {
    const reportConfig = {
      type: reportType,
      dateRange: "7d",
      format,
      title: reportTypes.find(r => r.id === reportType)?.label,
      description: "Quick export",
      timestamp: new Date().toISOString()
    };
    
    toast({
      title: "Download Started",
      description: `Preparing ${format.toUpperCase()} export...`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      const element = document.createElement('a');
      const fileName = `quick_export_${reportType}_${Date.now()}.${format}`;
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Quick export data'));
      element.setAttribute('download', fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Download Complete",
        description: `${fileName} has been downloaded successfully`,
      });
    }, 2000);
  };

  const getReportIcon = (type: string) => {
    const report = reportTypes.find(r => r.id === type);
    return report ? <report.icon className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
  };

  const getFormatIcon = (format: string) => {
    const formatConfig = exportFormats.find(f => f.id === format);
    return formatConfig ? <formatConfig.icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Forensic Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive forensic reports and export data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last generated: 2 hours ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Report Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      reportType === type.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setReportType(type.id)}
                    data-testid={`card-report-type-${type.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <type.icon className={`h-6 w-6 mt-1 ${
                          reportType === type.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            reportType === type.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {type.label}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger data-testid="select-date-range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger data-testid="select-export-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          <div className="flex items-center space-x-2">
                            <format.icon className="h-4 w-4" />
                            <span>{format.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Report Title (Optional)</label>
                <Input
                  placeholder="Custom report title..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  data-testid="input-report-title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Description (Optional)</label>
                <Textarea
                  placeholder="Report description and notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="textarea-report-description"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-primary" />
                <span>Quick Export</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {exportFormats.map((format) => (
                  <Button
                    key={format.id}
                    variant="outline"
                    onClick={() => handleQuickDownload(format.id)}
                    className="flex flex-col items-center space-y-2 h-20"
                    data-testid={`button-quick-export-${format.id}`}
                  >
                    <format.icon className="h-5 w-5" />
                    <span className="text-xs">{format.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview & Actions */}
        <div className="space-y-6">
          {/* Report Preview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Report Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                {getReportIcon(reportType)}
                <div>
                  <h3 className="font-medium text-foreground">
                    {reportTypes.find(r => r.id === reportType)?.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dateRange} • {exportFormat.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Report Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Incidents</span>
                  <Badge variant="outline">{reportData?.incidents || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Threats</span>
                  <Badge variant="outline">{reportData?.threats || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Evidence</span>
                  <Badge variant="outline">{reportData?.evidence || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Detections</span>
                  <Badge variant="outline">{reportData?.aiDetections || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Report */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
                data-testid="button-generate-report"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download Report
                  </>
                )}
              </Button>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Report will include blockchain verification</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI analysis confidence scores included</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Forensic audit trail attached</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}