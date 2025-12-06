export type MedicationStatus = 'taken' | 'missed' | 'pending' | 'upcoming';

export type MedicationFrequency = 'once' | 'twice' | 'three-times' | 'four-times' | 'as-needed';

export type MedicationIconName = 
  | 'pill'
  | 'tablets'
  | 'capsule'
  | 'syringe'
  | 'heart-pulse'
  | 'droplets'
  | 'thermometer'
  | 'stethoscope'
  | 'activity'
  | 'eye'
  | 'brain'
  | 'bone';

export interface MedicationDose {
  id: string;
  time: string;
  status: MedicationStatus;
  takenAt?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  instructions?: string;
  color: string;
  iconName: MedicationIconName;
  stock: number;
  refillReminder: boolean;
  doses: MedicationDose[];
  createdAt: string;
}

export interface DailyAdherence {
  date: string;
  taken: number;
  missed: number;
  total: number;
  percentage: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  notificationsEnabled: boolean;
  createdAt: string;
}
