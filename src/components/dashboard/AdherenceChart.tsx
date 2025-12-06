import { cn } from '@/lib/utils';
import { DailyAdherence } from '@/types/medication';

interface AdherenceChartProps {
  data: DailyAdherence[];
  className?: string;
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const AdherenceChart = ({ data, className }: AdherenceChartProps) => {
  const maxHeight = 60;

  return (
    <div className={cn('', className)}>
      <div className="flex items-end justify-between gap-2 h-20">
        {data.map((day, index) => {
          const height = (day.percentage / 100) * maxHeight;
          const isToday = index === data.length - 1;
          
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="relative w-full max-w-[32px] rounded-lg transition-all duration-300"
                style={{ height: `${height}px` }}
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-lg transition-all duration-300',
                    day.percentage >= 80
                      ? 'bg-success'
                      : day.percentage >= 50
                      ? 'bg-warning'
                      : 'bg-destructive',
                    isToday && 'ring-2 ring-offset-2 ring-offset-card ring-primary'
                  )}
                  style={{
                    opacity: 0.2 + (day.percentage / 100) * 0.8,
                  }}
                />
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isToday ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {dayLabels[index % 7]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
