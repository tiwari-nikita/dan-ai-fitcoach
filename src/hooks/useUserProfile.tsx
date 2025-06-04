import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types'; // Import Json type
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_metadata')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const setUserInfo = async (key: string, value: any) => {
    if (!user) {
      return { success: false, error: "User not authenticated. Cannot set user info." };
    }

    try {
      // Fetch current user_metadata to merge
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('user_metadata')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const existingMetadata: Json = currentProfile?.user_metadata || {};
      const updatedMetadata: Json = {
        ...(existingMetadata as Record<string, any>),
        [key]: value,
      };

      const { error } = await supabase
        .from('profiles')
        .update({ user_metadata: updatedMetadata })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(); // Refresh profile data after update
      toast({
        title: "User Info Updated",
        description: `Successfully updated user information for key: ${key}.`,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error setting user info:', error);
      toast({
        title: "Error",
        description: `Failed to update user information for key: ${key}.`,
        variant: "destructive"
      });
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  const getUserInfo = (key?: string): any | Json | null => {
    if (!userProfile) {
      return null;
    }
    const metadata = userProfile.user_metadata;
    if (key) {
      return (metadata as Record<string, any>)?.[key] || null;
    }
    return metadata;
  };

  return {
    userProfile,
    isLoading,
    fetchUserProfile,
    setUserInfo,
    getUserInfo,
  };
};