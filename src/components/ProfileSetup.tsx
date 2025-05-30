import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Activity, Dumbbell, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSetup = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    experience: '',
    goals: '',
    injuries: '',
    preferences: '',
    targetWeight: '',
    fitnessGoals: [] as string[]
  });

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age?.toString() || '',
          height: data.height || '',
          weight: data.weight?.toString() || '',
          gender: data.gender || '',
          activityLevel: data.activity_level || '',
          experience: data.experience || '',
          goals: data.goals || '',
          injuries: data.injuries || '',
          preferences: data.preferences || '',
          targetWeight: data.target_weight?.toString() || '',
          fitnessGoals: data.fitness_goals || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          age: profile.age ? parseInt(profile.age) : null,
          height: profile.height,
          weight: profile.weight ? parseFloat(profile.weight) : null,
          gender: profile.gender,
          activity_level: profile.activityLevel,
          experience: profile.experience,
          goals: profile.goals,
          injuries: profile.injuries,
          preferences: profile.preferences,
          target_weight: profile.targetWeight ? parseFloat(profile.targetWeight) : null,
          fitness_goals: profile.fitnessGoals,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your fitness profile has been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'light', label: 'Lightly active (1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
    { value: 'very', label: 'Very active (6-7 days/week)' },
    { value: 'extra', label: 'Extra active (2x/day or intense exercise)' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-6 months)' },
    { value: 'intermediate', label: 'Intermediate (6 months - 2 years)' },
    { value: 'advanced', label: 'Advanced (2+ years)' },
    { value: 'expert', label: 'Expert (5+ years)' }
  ];

  const fitnessGoalOptions = [
    'Lose Weight', 'Build Muscle', 'Increase Strength', 'Improve Endurance',
    'Better Energy', 'Stress Relief', 'General Health'
  ];

  const toggleFitnessGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-white">
            <User className="h-8 w-8 mr-3 text-green-500" />
            Create Your Fitness Profile
          </CardTitle>
          <p className="text-gray-300 text-lg">Help Dan Go AI understand you better for personalized coaching</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Heart className="h-6 w-6 mr-2 text-green-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-black font-semibold">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Enter your full name"
                className="bg-white border-gray-300 text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-black font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  placeholder="Age"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-black font-semibold">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                  <SelectTrigger className="bg-white border-gray-300 text-black">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="male" className="text-black">Male</SelectItem>
                    <SelectItem value="female" className="text-black">Female</SelectItem>
                    <SelectItem value="other" className="text-black">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight" className="text-black font-semibold">Current Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({...profile, weight: e.target.value})}
                  placeholder="Weight"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <div>
                <Label htmlFor="targetWeight" className="text-black font-semibold">Target Weight (lbs)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={profile.targetWeight}
                  onChange={(e) => setProfile({...profile, targetWeight: e.target.value})}
                  placeholder="Target"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="height" className="text-black font-semibold">Height (ft'in" or cm)</Label>
              <Input
                id="height"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                placeholder="e.g., 5'10&quot; or 178cm"
                className="bg-white border-gray-300 text-black"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Activity className="h-6 w-6 mr-2 text-green-500" />
              Fitness Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-black font-semibold">Current Activity Level</Label>
              <Select value={profile.activityLevel} onValueChange={(value) => setProfile({...profile, activityLevel: value})}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className="text-black">
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-black font-semibold">Exercise Experience</Label>
              <Select value={profile.experience} onValueChange={(value) => setProfile({...profile, experience: value})}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className="text-black">
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-black font-semibold mb-3 block">Fitness Goals (select multiple)</Label>
              <div className="grid grid-cols-2 gap-2">
                {fitnessGoalOptions.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => toggleFitnessGoal(goal)}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all text-center text-sm ${
                      profile.fitnessGoals.includes(goal)
                        ? 'border-green-500 bg-green-100 text-black'
                        : 'border-gray-300 bg-white text-black hover:border-green-300'
                    }`}
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-black">
            <Dumbbell className="h-6 w-6 mr-2 text-green-500" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="injuries" className="text-black font-semibold">Injuries or Physical Limitations</Label>
            <Textarea
              id="injuries"
              value={profile.injuries}
              onChange={(e) => setProfile({...profile, injuries: e.target.value})}
              placeholder="Describe any injuries, surgeries, or physical limitations we should know about..."
              className="bg-white border-gray-300 text-black min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="preferences" className="text-black font-semibold">Exercise Preferences &amp; Additional Goals</Label>
            <Textarea
              id="preferences"
              value={profile.preferences}
              onChange={(e) => setProfile({...profile, preferences: e.target.value})}
              placeholder="What types of workouts do you enjoy? Any equipment preferences? Specific goals?"
              className="bg-white border-gray-300 text-black min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold shadow-lg"
          size="lg"
        >
          {loading ? 'Saving...' : 'Save Profile & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;
