import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MedicationStatus, Medication, MedicationDose } from '@/types/medication';
import { medicationIcons } from '@/components/medications/MedicationIcons';

interface MedicationCardProps {
  medication: Medication;
  dose: MedicationDose;
  onMarkTaken: (medicationId: string, doseId: string) => void;
  onMarkMissed: (medicationId: string, doseId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const statusConfig: Record<MedicationStatus, { icon: typeof Check; label: string; className: string }> = {
  taken: {
    icon: Check,
    label: 'Taken',
    className: 'bg-success/10 text-success border-success/20',
  },
  missed: {
    icon: X,
    label: 'Missed',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    icon: AlertCircle,
    label: 'Due Now',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  upcoming: {
    icon: Clock,
    label: 'Upcoming',
    className: 'bg-secondary text-muted-foreground border-border',
  },
};

export const MedicationCard = ({
  medication,
  dose,
  onMarkTaken,
  onMarkMissed,
  className,
  style,
}: MedicationCardProps) => {
  const status = statusConfig[dose.status];
  const StatusIcon = status.icon;
  const isPending = dose.status === 'pending';
  const isUpcoming = dose.status === 'upcoming';
  const isActionable = isPending || isUpcoming;

  const MedIcon = medicationIcons[medication.iconName];

  return (
    <div
      className={cn(
        'medication-card bg-card border border-border/50',
        isPending && 'ring-2 ring-warning/30 bg-warning/5',
        className
      )}
      style={style}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${medication.color}15` }}
        >
          <MedIcon className="w-6 h-6" style={{ color: medication.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">
                {medication.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {medication.dosage} • {dose.time}
              </p>
            </div>
            
            {/* Status Badge */}
            <div
              className={cn(
                'pill-badge border',
                status.className
              )}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </div>
          </div>

          {medication.instructions && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
              {medication.instructions}
            </p>
          )}

          {/* Actions */}
          {isActionable && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="success"
                className="flex-1"
                onClick={() => onMarkTaken(medication.id, dose.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Take
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-muted-foreground"
                onClick={() => onMarkMissed(medication.id, dose.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {dose.status === 'taken' && dose.takenAt && (
            <p className="text-xs text-success mt-2">
              Taken at {dose.takenAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
