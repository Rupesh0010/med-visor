import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Bell, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsight {
  type: 'anomaly' | 'opportunity' | 'alert';
  title: string;
  description: string;
  action: string;
  severity: 'low' | 'medium' | 'high';
}

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5" />;
      case 'alert':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getCardVariant = (type: string) => {
    switch (type) {
      case 'anomaly':
        return 'border-l-4 border-l-destructive bg-gradient-to-r from-destructive/5 to-card';
      case 'opportunity':
        return 'border-l-4 border-l-primary bg-gradient-to-r from-primary-light to-card';
      case 'alert':
        return 'border-l-4 border-l-warning bg-gradient-to-r from-warning-light to-card';
      default:
        return 'border-l-4 border-l-primary bg-gradient-to-r from-primary-light to-card';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg transition-all duration-200 hover:shadow-card",
              getCardVariant(insight.type)
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-full",
                  insight.type === 'anomaly' ? 'bg-destructive/20 text-destructive' :
                  insight.type === 'opportunity' ? 'bg-primary/20 text-primary' :
                  'bg-warning/20 text-warning'
                )}>
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">
                    {insight.title}
                  </h4>
                  <Badge 
                    variant={getSeverityColor(insight.severity) as any}
                    className="text-xs mt-1"
                  >
                    {insight.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {insight.description}
            </p>
            
            <Button 
              size="sm" 
              variant="medical"
              className="text-xs"
            >
              {insight.action}
              {insight.action.includes('Download') && (
                <Download className="w-3 h-3 ml-1" />
              )}
            </Button>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border">
          <Button variant="default" className="w-full">
            View All AI Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}