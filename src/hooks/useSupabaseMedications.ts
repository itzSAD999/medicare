import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MedicationIconName, MedicationFrequency, MedicationStatus } from '@/types/medication';

export interface DbMedication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string | null;
  color: string;
  icon_name: string;
  stock: number;
  refill_reminder: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbDose {
  id: string;
  medication_id: string;
  user_id: string;
  scheduled_time: string;
  status: string;
  taken_at: string | null;
  dose_date: string;
  created_at: string;
}

export interface MedicationWithDoses extends DbMedication {
  doses: DbDose[];
}

export const useSupabaseMedications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<MedicationWithDoses[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedications = useCallback(async () => {
    if (!user) {
      setMedications([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch medications
      const { data: medsData, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (medsError) throw medsError;

      // Fetch today's doses
      const today = new Date().toISOString().split('T')[0];
      const { data: dosesData, error: dosesError } = await supabase
        .from('medication_doses')
        .select('*')
        .eq('user_id', user.id)
        .eq('dose_date', today);

      if (dosesError) throw dosesError;

      // Combine medications with their doses
      const medsWithDoses = (medsData || []).map((med) => ({
        ...med,
        doses: (dosesData || []).filter((dose) => dose.medication_id === med.id),
      }));

      setMedications(medsWithDoses);
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast.error('Failed to load medications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedications();

    // Subscribe to realtime updates
    if (user) {
      const medsChannel = supabase
        .channel('medications-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'medications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchMedications();
          }
        )
        .subscribe();

      const dosesChannel = supabase
        .channel('doses-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'medication_doses',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchMedications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(medsChannel);
        supabase.removeChannel(dosesChannel);
      };
    }
  }, [user, fetchMedications]);

  const addMedication = async (medication: {
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    instructions?: string;
    iconName: MedicationIconName;
    color: string;
    stock: number;
    refillReminder: boolean;
    times: string[];
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Insert medication
      const { data: medData, error: medError } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          instructions: medication.instructions || null,
          icon_name: medication.iconName,
          color: medication.color,
          stock: medication.stock,
          refill_reminder: medication.refillReminder,
        })
        .select()
        .single();

      if (medError) throw medError;

      // Insert doses for today
      const today = new Date().toISOString().split('T')[0];
      const dosesToInsert = medication.times.map((time) => ({
        medication_id: medData.id,
        user_id: user.id,
        scheduled_time: time,
        status: 'upcoming',
        dose_date: today,
      }));

      if (dosesToInsert.length > 0) {
        const { error: dosesError } = await supabase
          .from('medication_doses')
          .insert(dosesToInsert);

        if (dosesError) throw dosesError;
      }

      toast.success('Medication added successfully!');
      return { error: null, data: medData };
    } catch (error: any) {
      toast.error('Failed to add medication');
      return { error };
    }
  };

  const updateMedication = async (id: string, updates: Partial<DbMedication>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Medication updated!');
      return { error: null };
    } catch (error: any) {
      toast.error('Failed to update medication');
      return { error };
    }
  };

  const deleteMedication = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Medication removed');
      return { error: null };
    } catch (error: any) {
      toast.error('Failed to delete medication');
      return { error };
    }
  };

  const markDoseTaken = async (medicationId: string, doseId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Update dose status
      const { error: doseError } = await supabase
        .from('medication_doses')
        .update({
          status: 'taken',
          taken_at: new Date().toISOString(),
        })
        .eq('id', doseId)
        .eq('user_id', user.id);

      if (doseError) throw doseError;

      // Decrement stock
      const med = medications.find(m => m.id === medicationId);
      if (med) {
        await supabase
          .from('medications')
          .update({ stock: Math.max(0, med.stock - 1) })
          .eq('id', medicationId);
      }

      // Log adherence
      await supabase.from('adherence_logs').insert({
        user_id: user.id,
        medication_id: medicationId,
        dose_id: doseId,
        action: 'taken',
      });

      toast.success('Medication marked as taken! 💊');
      return { error: null };
    } catch (error: any) {
      toast.error('Failed to update dose');
      return { error };
    }
  };

  const markDoseMissed = async (medicationId: string, doseId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('medication_doses')
        .update({ status: 'missed' })
        .eq('id', doseId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Log adherence
      await supabase.from('adherence_logs').insert({
        user_id: user.id,
        medication_id: medicationId,
        dose_id: doseId,
        action: 'missed',
      });

      toast.error('Medication marked as missed');
      return { error: null };
    } catch (error: any) {
      toast.error('Failed to update dose');
      return { error };
    }
  };

  const getTodayDoses = useCallback(() => {
    return medications.flatMap((med) =>
      med.doses.map((dose) => ({
        ...dose,
        medication: med,
      }))
    ).sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));
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
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    markDoseTaken,
    markDoseMissed,
    getTodayDoses,
    getStats,
    refetch: fetchMedications,
  };
};
