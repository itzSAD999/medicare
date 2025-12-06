import { Medication, DailyAdherence, User } from '@/types/medication';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  notificationsEnabled: true,
  createdAt: '2024-01-15',
};

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'twice',
    instructions: 'Take with meals',
    color: '#0D9488',
    iconName: 'pill',
    stock: 45,
    refillReminder: true,
    doses: [
      { id: '1a', time: '08:00', status: 'taken', takenAt: '08:05' },
      { id: '1b', time: '20:00', status: 'pending' },
    ],
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'once',
    instructions: 'Take in the morning',
    color: '#3B82F6',
    iconName: 'heart-pulse',
    stock: 28,
    refillReminder: true,
    doses: [
      { id: '2a', time: '09:00', status: 'taken', takenAt: '09:12' },
    ],
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'once',
    instructions: 'Take with food',
    color: '#F59E0B',
    iconName: 'droplets',
    stock: 60,
    refillReminder: false,
    doses: [
      { id: '3a', time: '12:00', status: 'upcoming' },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'Omeprazole',
    dosage: '20mg',
    frequency: 'once',
    instructions: 'Take 30 min before breakfast',
    color: '#8B5CF6',
    iconName: 'capsule',
    stock: 12,
    refillReminder: true,
    doses: [
      { id: '4a', time: '07:30', status: 'missed' },
    ],
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Atorvastatin',
    dosage: '40mg',
    frequency: 'once',
    instructions: 'Take at bedtime',
    color: '#EC4899',
    iconName: 'tablets',
    stock: 30,
    refillReminder: true,
    doses: [
      { id: '5a', time: '22:00', status: 'upcoming' },
    ],
    createdAt: '2024-01-25',
  },
];

export const mockWeeklyAdherence: DailyAdherence[] = [
  { date: '2024-12-01', taken: 5, missed: 0, total: 5, percentage: 100 },
  { date: '2024-12-02', taken: 4, missed: 1, total: 5, percentage: 80 },
  { date: '2024-12-03', taken: 5, missed: 0, total: 5, percentage: 100 },
  { date: '2024-12-04', taken: 3, missed: 2, total: 5, percentage: 60 },
  { date: '2024-12-05', taken: 5, missed: 0, total: 5, percentage: 100 },
  { date: '2024-12-06', taken: 4, missed: 1, total: 5, percentage: 80 },
  { date: '2024-12-07', taken: 2, missed: 0, total: 5, percentage: 40 },
];

export const getAdherenceStats = () => {
  const total = mockWeeklyAdherence.reduce((acc, day) => acc + day.total, 0);
  const taken = mockWeeklyAdherence.reduce((acc, day) => acc + day.taken, 0);
  const missed = mockWeeklyAdherence.reduce((acc, day) => acc + day.missed, 0);
  
  return {
    weeklyPercentage: Math.round((taken / total) * 100),
    totalDoses: total,
    takenDoses: taken,
    missedDoses: missed,
    streak: 3,
  };
};

export const getTodayMedications = () => {
  return mockMedications.flatMap(med => 
    med.doses.map(dose => ({
      ...dose,
      medication: med,
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));
};
