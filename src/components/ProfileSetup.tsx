
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Activity, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSetup = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    experience: '',
    injuries: '',
    preferences: ''
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully!",
    });
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="fitness-gradient text-white border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <User className="h-6 w-6 mr-2" />
            Create Your Fitness Profile
          </CardTitle>
          <p className="text-white/90">Help Dan Go AI understand you better for personalized coaching</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fitness-card-gradient border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Enter your full name"
                className="bg-white/70"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  placeholder="Age"
                  className="bg-white/70"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({...profile, weight: e.target.value})}
                  placeholder="Weight"
                  className="bg-white/70"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="height">Height (ft&apos;in&quot; or cm)</Label>
              <Input
                id="height"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                placeholder="e.g., 5'10&quot; or 178cm"
                className="bg-white/70"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="fitness-card-gradient border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-fitness-secondary" />
              Fitness Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Activity Level</Label>
              <Select value={profile.activityLevel} onValueChange={(value) => setProfile({...profile, activityLevel: value})}>
                <SelectTrigger className="bg-white/70">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exercise Experience</Label>
              <Select value={profile.experience} onValueChange={(value) => setProfile({...profile, experience: value})}>
                <SelectTrigger className="bg-white/70">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="fitness-card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-fitness-primary" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="injuries">Injuries or Physical Limitations</Label>
            <Textarea
              id="injuries"
              value={profile.injuries}
              onChange={(e) => setProfile({...profile, injuries: e.target.value})}
              placeholder="Describe any injuries, surgeries, or physical limitations we should know about..."
              className="bg-white/70 min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="preferences">Exercise Preferences &amp; Goals</Label>
            <Textarea
              id="preferences"
              value={profile.preferences}
              onChange={(e) => setProfile({...profile, preferences: e.target.value})}
              placeholder="What types of workouts do you enjoy? What are your main fitness goals? Any equipment preferences?"
              className="bg-white/70 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          className="fitness-gradient text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow"
          size="lg"
        >
          Save Profile &amp; Continue
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;
