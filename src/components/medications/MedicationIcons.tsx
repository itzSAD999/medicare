import {
  Pill,
  Tablets,
  Syringe,
  HeartPulse,
  Droplets,
  Thermometer,
  Stethoscope,
  Activity,
  Eye,
  Brain,
  Bone,
  type LucideIcon,
} from 'lucide-react';
import { MedicationIconName } from '@/types/medication';

// Capsule icon - custom since Lucide doesn't have one
import { forwardRef } from 'react';

const Capsule = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.5 3.5a6.5 6.5 0 0 0-9.19 9.19l9.19 9.19a6.5 6.5 0 0 0 9.19-9.19l-9.19-9.19Z" />
      <path d="m6 14 8-8" />
    </svg>
  )
);
Capsule.displayName = 'Capsule';

export const medicationIcons: Record<MedicationIconName, LucideIcon | typeof Capsule> = {
  pill: Pill,
  tablets: Tablets,
  capsule: Capsule as unknown as LucideIcon,
  syringe: Syringe,
  'heart-pulse': HeartPulse,
  droplets: Droplets,
  thermometer: Thermometer,
  stethoscope: Stethoscope,
  activity: Activity,
  eye: Eye,
  brain: Brain,
  bone: Bone,
};

export const medicationIconList: { name: MedicationIconName; label: string }[] = [
  { name: 'pill', label: 'Pill' },
  { name: 'tablets', label: 'Tablets' },
  { name: 'capsule', label: 'Capsule' },
  { name: 'syringe', label: 'Syringe' },
  { name: 'heart-pulse', label: 'Heart' },
  { name: 'droplets', label: 'Drops' },
  { name: 'thermometer', label: 'Temperature' },
  { name: 'stethoscope', label: 'Medical' },
  { name: 'activity', label: 'Activity' },
  { name: 'eye', label: 'Eye Care' },
  { name: 'brain', label: 'Neuro' },
  { name: 'bone', label: 'Bone Health' },
];

export const medicationColors = [
  '#0D9488',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#10B981',
  '#6366F1',
  '#EF4444',
  '#06B6D4',
  '#84CC16',
];
