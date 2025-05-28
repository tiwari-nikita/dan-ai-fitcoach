
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes: string | null;
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

  useEffect(() => {
    fetchWeightEntries();
  }, [user]);

  return {
    weightEntries,
    loading,
    addWeightEntry,
    refetch: fetchWeightEntries
  };
};
