
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes: string | null;
  muscle_mass: number | null;
  body_fat: number | null;
  created_at: string;
}

interface AddWeightEntryParams {
  weight_kg: number;
  entry_date: string;
  notes?: string | null;
  muscle_mass?: number | null;
  body_fat?: number | null;
}

export const useWeightEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeightEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Ensure newest entries are first for display, as per user feedback.
      // Supabase's `ascending: false` should put newest first, but if not,
      // explicitly reverse here.
      setWeightEntries(data || []);
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      toast({
        title: "Error",
        description: "Failed to load weight entries.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const addWeightEntry = async (params: AddWeightEntryParams) => {
    if (!user) {
      throw new Error("User not authenticated. Cannot add weight entry.");
    }

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([{
          user_id: user.id,
          weight: params.weight_kg,
          date: params.entry_date,
          notes: params.notes || null,
          muscle_mass: params.muscle_mass || null,
          body_fat: params.body_fat || null,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setWeightEntries(prev => [data, ...prev]);
      toast({
        title: "Weight Logged",
        description: `Weight of ${params.weight_kg} kg on ${params.entry_date} has been recorded successfully!`,
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to add weight entry.",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  const updateWeightEntry = async (id: string, updates: Partial<Omit<WeightEntry, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setWeightEntries(prev => prev.map(entry => (entry.id === id ? data : entry)));
      toast({
        title: "Weight Entry Updated",
        description: "Your weight entry has been updated successfully!",
      });
      return data;
    } catch (error) {
      console.error('Error updating weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to update weight entry.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteWeightEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeightEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Weight Entry Deleted",
        description: "Your weight entry has been deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete weight entry.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchWeightEntries();
  }, [user]);

  return {
    weightEntries,
    loading,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    refetch: fetchWeightEntries
  };
};
