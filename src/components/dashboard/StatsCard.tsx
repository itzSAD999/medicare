import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border border-border/50',
  success: 'bg-success/10 border border-success/20',
  warning: 'bg-warning/10 border border-warning/20',
  primary: 'bg-primary/10 border border-primary/20',
};

const iconVariants = {
  default: 'bg-secondary text-foreground',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  primary: 'bg-primary/20 text-primary',
};

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        'stat-card',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium mt-2',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            iconVariants[variant]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
