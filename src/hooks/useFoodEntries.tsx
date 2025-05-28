
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FoodEntry {
  id: string;
  food_description: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
  meal_type: string;
  date: string;
  logged_at: string;
}

export const useFoodEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFoodEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setFoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching food entries:', error);
      toast({
        title: "Error",
        description: "Failed to load food entries.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'logged_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert([{
          ...entry,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setFoodEntries(prev => [data, ...prev]);
      toast({
        title: "Food Added",
        description: `${entry.food_description} has been logged successfully!`,
      });
      
      return data;
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        title: "Error",
        description: "Failed to add food entry.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFoodEntries();
  }, [user]);

  return {
    foodEntries,
    loading,
    addFoodEntry,
    refetch: fetchFoodEntries
  };
};
