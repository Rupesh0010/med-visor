import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default',
  className 
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-4 border-l-success bg-gradient-to-r from-success-light to-card';
      case 'warning':
        return 'border-l-4 border-l-warning bg-gradient-to-r from-warning-light to-card';
      case 'destructive':
        return 'border-l-4 border-l-destructive bg-gradient-to-r from-destructive/10 to-card';
      default:
        return 'border-l-4 border-l-primary bg-gradient-to-r from-primary-light to-card';
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.type === 'increase' ? 'text-success' : 'text-destructive';
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-hover hover:scale-105",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-card-foreground">
              {value}
            </p>
            {change && (
              <p className={cn("text-sm font-medium mt-1", getChangeColor())}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                <span className="text-muted-foreground ml-1">vs last period</span>
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full",
            variant === 'success' ? 'bg-success/20 text-success' :
            variant === 'warning' ? 'bg-warning/20 text-warning' :
            variant === 'destructive' ? 'bg-destructive/20 text-destructive' :
            'bg-primary/20 text-primary'
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}