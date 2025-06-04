
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

  const getWeightEntries = async () => {
    if (!user) {
      console.warn("User not authenticated. Cannot fetch weight entries.");
      return [];
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWeightEntries(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      toast({
        title: "Error",
        description: "Failed to load weight entries.",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
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

  const modifyWeightEntry = async ({ original_entry_date, new_weight_kg, new_entry_date }: { original_entry_date: string, new_weight_kg: number, new_entry_date?: string | null }) => {
    if (!user) {
      return { success: false, error: "User not authenticated. Cannot modify weight entry." };
    }

    try {
      const updatePayload: Partial<Omit<WeightEntry, 'id' | 'created_at' | 'user_id'>> = {
        weight: new_weight_kg,
      };

      if (new_entry_date) {
        updatePayload.date = new_entry_date;
      }

      const { data, error } = await supabase
        .from('weight_entries')
        .update(updatePayload)
        .eq('user_id', user.id)
        .eq('date', original_entry_date)
        .select()
        .single();

      if (error) throw error;

      // Refetch entries to ensure local state consistency after modification,
      // especially if the entry date was changed.
      await getWeightEntries();
      toast({
        title: "Weight Entry Modified",
        description: `Weight entry for ${original_entry_date} has been modified successfully!`,
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('Error modifying weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to modify weight entry.",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  const deleteWeightEntry = async (entryDate: string) => {
    if (!user) {
      return { success: false, error: "User not authenticated. Cannot delete weight entry." };
    }

    try {
      const { error, count } = await supabase
        .from('weight_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('date', entryDate);

      if (error) {
        throw error;
      }

      if (count === 0) {
        return { success: false, error: `No weight entry found for date: ${entryDate}.` };
      }

      setWeightEntries(prev => prev.filter(entry => entry.date !== entryDate));
      toast({
        title: "Weight Entry Deleted",
        description: `Weight entry for ${entryDate} has been deleted successfully!`,
      });
      return { success: true, message: `Weight entry for ${entryDate} deleted.` };
    } catch (error: any) {
      console.error('Error deleting weight entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete weight entry.",
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  useEffect(() => {
    getWeightEntries();
  }, [user]);

  return {
    weightEntries,
    loading,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    modifyWeightEntry,
    getWeightEntries,
    refetch: getWeightEntries
  };
};
