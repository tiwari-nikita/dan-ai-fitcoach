
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

interface AddFoodEntryParams {
  food_description: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
meal_type: string;
date: string;
}

interface ModifyFoodEntryParams {
  original_food_description: string;
  new_food_description?: string;
  calories?: number;
  protein_g?: number | null;
  carbs_g?: number | null;
  fats_g?: number | null;
  meal_type?: string;
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

  const addFoodEntry = async (params: AddFoodEntryParams) => {
    if (!user) {
      throw new Error("User not authenticated. Cannot add food entry.");
    }

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert([{
          user_id: user.id,
          food_description: params.food_description,
          calories: params.calories,
          protein_g: params.protein_g,
          carbs_g: params.carbs_g,
          fats_g: params.fats_g,
          meal_type: params.meal_type,
          date: params.date,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setFoodEntries(prev => [data, ...prev]);
      toast({
        title: "Food Added",
        description: `${params.food_description} has been logged successfully!`,
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

  const deleteFoodEntry = async (food_description: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated. Cannot delete food entry.",
        variant: "destructive"
      });
      return { success: false, error: "User not authenticated." };
    }

    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('food_description', food_description);

      if (error) {
        throw error;
      }

      setFoodEntries(prev => prev.filter(entry => entry.food_description !== food_description));
      toast({
        title: "Food Entry Deleted",
        description: `"${food_description}" has been removed successfully.`,
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting food entry:', error);
      toast({
        title: "Error",
        description: `Failed to delete food entry: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  const updateFoodEntry = async (id: string, updates: Partial<AddFoodEntryParams>) => {
    if (!user) {
      throw new Error("User not authenticated. Cannot update food entry.");
    }

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFoodEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      toast({
        title: "Food Entry Updated",
        description: "The food entry has been updated successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error updating food entry:', error);
      toast({
        title: "Error",
        description: "Failed to update food entry.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const modifyFoodEntry = async ({ original_food_description, ...updates }: ModifyFoodEntryParams) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated. Cannot modify food entry.",
        variant: "destructive"
      });
      return { success: false, error: "User not authenticated." };
    }

    try {
      // First, find the entry by original_food_description
      const { data: existingEntries, error: fetchError } = await supabase
        .from('food_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('food_description', original_food_description);

      if (fetchError) throw fetchError;

      if (!existingEntries || existingEntries.length === 0) {
        toast({
          title: "Error",
          description: `Food entry "${original_food_description}" not found.`,
          variant: "destructive"
        });
        return { success: false, error: "Food entry not found." };
      }

      const entryIdToUpdate = existingEntries[0].id;

      // Prepare updates object, ensuring food_description is updated if new_food_description is provided
      const updatePayload: Partial<FoodEntry> = {};
      if (updates.new_food_description !== undefined) {
        updatePayload.food_description = updates.new_food_description;
      }
      if (updates.calories !== undefined) {
        updatePayload.calories = updates.calories;
      }
      if (updates.protein_g !== undefined) {
        updatePayload.protein_g = updates.protein_g;
      }
      if (updates.carbs_g !== undefined) {
        updatePayload.carbs_g = updates.carbs_g;
      }
      if (updates.fats_g !== undefined) {
        updatePayload.fats_g = updates.fats_g;
      }
      if (updates.meal_type !== undefined) {
        updatePayload.meal_type = updates.meal_type;
      }

      const { data, error } = await supabase
        .from('food_entries')
        .update(updatePayload)
        .eq('id', entryIdToUpdate)
        .select()
        .single();

      if (error) throw error;

      setFoodEntries(prev => prev.map(entry => entry.id === entryIdToUpdate ? data : entry));
      toast({
        title: "Food Entry Modified",
        description: `"${original_food_description}" has been updated successfully.`,
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error modifying food entry:', error);
      toast({
        title: "Error",
        description: `Failed to modify food entry: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };
 
   useEffect(() => {
     fetchFoodEntries();
   }, [user]);

  return {
    foodEntries,
    loading,
    addFoodEntry,
    deleteFoodEntry,
    updateFoodEntry,
    modifyFoodEntry, // Expose the new function
    refetch: fetchFoodEntries,
    getFoodEntries: fetchFoodEntries
  };
};
