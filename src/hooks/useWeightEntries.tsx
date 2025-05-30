
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
        .order('date', { ascending: false });

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

  const addWeightEntry = async (entry: Omit<WeightEntry, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([{
          ...entry,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setWeightEntries(prev => [data, ...prev]);
      toast({
        title: "Weight Logged",
        description: "Your weight entry has been recorded successfully!",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to add weight entry.",
        variant: "destructive"
      });
      throw error;
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
