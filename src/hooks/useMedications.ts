import { useState, useCallback } from 'react';
import { Medication, MedicationIconName } from '@/types/medication';
import { mockMedications } from '@/data/mockData';
import { toast } from 'sonner';

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);

  const markDoseTaken = useCallback((medicationId: string, doseId: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medicationId) {
          return {
            ...med,
            stock: Math.max(0, med.stock - 1),
            doses: med.doses.map((dose) =>
              dose.id === doseId
                ? {
                    ...dose,
                    status: 'taken' as const,
                    takenAt: new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  }
                : dose
            ),
          };
        }
        return med;
      })
    );
    toast.success('Medication marked as taken! 💊');
  }, []);

  const markDoseMissed = useCallback((medicationId: string, doseId: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medicationId) {
          return {
            ...med,
            doses: med.doses.map((dose) =>
              dose.id === doseId
                ? { ...dose, status: 'missed' as const }
                : dose
            ),
          };
        }
        return med;
      })
    );
    toast.error('Medication marked as missed');
  }, []);

  const addMedication = useCallback((medication: Omit<Medication, 'id' | 'createdAt'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMedications((prev) => [...prev, newMedication]);
    toast.success('Medication added successfully!');
  }, []);

  const updateMedication = useCallback((id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
    );
    toast.success('Medication updated!');
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    toast.success('Medication removed');
  }, []);

  const getTodayDoses = useCallback(() => {
    return medications.flatMap((med) =>
      med.doses.map((dose) => ({
        ...dose,
        medication: med,
      }))
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [medications]);

  const getStats = useCallback(() => {
    const allDoses = medications.flatMap((m) => m.doses);
    const taken = allDoses.filter((d) => d.status === 'taken').length;
    const missed = allDoses.filter((d) => d.status === 'missed').length;
    const pending = allDoses.filter((d) => d.status === 'pending').length;
    const total = allDoses.length;

    return {
      taken,
      missed,
      pending,
      total,
      percentage: total > 0 ? Math.round((taken / total) * 100) : 0,
    };
  }, [medications]);

  return {
    medications,
    markDoseTaken,
    markDoseMissed,
    addMedication,
    updateMedication,
    deleteMedication,
    getTodayDoses,
    getStats,
  };
};
