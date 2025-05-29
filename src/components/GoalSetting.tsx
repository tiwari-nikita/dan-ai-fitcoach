
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Heart, Calendar, Activity, Weight, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoalSetting = () => {
  const { toast } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goalCategories = [
    {
      title: 'Weight Goals',
      icon: Weight,
      goals: [
        { id: 'lose-weight', title: 'Lose Weight', description: 'Burn fat and achieve a leaner physique' },
        { id: 'gain-weight', title: 'Gain Weight', description: 'Build muscle mass and increase overall weight' },
        { id: 'maintain-weight', title: 'Maintain Weight', description: 'Stay at current weight while improving body composition' }
      ]
    },
    {
      title: 'Strength Goals',
      icon: Dumbbell,
      goals: [
        { id: 'build-muscle', title: 'Build Muscle', description: 'Increase muscle mass and definition' },
        { id: 'increase-strength', title: 'Increase Strength', description: 'Get stronger and lift heavier weights' },
        { id: 'functional-fitness', title: 'Functional Fitness', description: 'Improve everyday movement and activities' }
      ]
    },
    {
      title: 'Cardio Goals',
      icon: Heart,
      goals: [
        { id: 'improve-endurance', title: 'Improve Endurance', description: 'Build cardiovascular fitness and stamina' },
        { id: 'run-marathon', title: 'Run a Marathon', description: 'Train for long-distance running events' },
        { id: 'general-cardio', title: 'General Cardio Health', description: 'Maintain heart health and fitness' }
      ]
    },
    {
      title: 'Lifestyle Goals',
      icon: Activity,
      goals: [
        { id: 'better-energy', title: 'Better Energy', description: 'Feel more energetic throughout the day' },
        { id: 'better-sleep', title: 'Improve Sleep', description: 'Get better quality rest and recovery' },
        { id: 'stress-relief', title: 'Stress Relief', description: 'Use fitness to manage stress and mental health' }
      ]
    }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const saveGoals = () => {
    console.log('Selected goals:', selectedGoals);
    toast({
      title: "Goals Set Successfully!",
      description: `You've selected ${selectedGoals.length} goals. Dan Go AI will create a personalized plan for you.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="fitness-gradient text-white border-0 shadow-xl transition-all duration-300 ease-in-out">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Dumbbell className="h-6 w-6 mr-2" />
            Set Your Fitness Goals
          </CardTitle>
          <p className="text-white/90">Choose your primary goals so Dan Go AI can create the perfect plan for you</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goalCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="h-5 w-5 mr-2 text-fitness-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out ${
                      selectedGoals.includes(goal.id)
                        ? 'border-fitness-primary bg-fitness-primary/10 shadow-md'
                        : 'border-gray-200 bg-white/50 hover:border-fitness-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base sm:text-lg">{goal.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{goal.description}</p>
                      </div>
                      {selectedGoals.includes(goal.id) && (
                        <Badge className="bg-fitness-primary text-white transition-all duration-200">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedGoals.length > 0 && (
        <Card className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-fitness-secondary" />
              Your Selected Goals ({selectedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGoals.map((goalId) => {
                const goal = goalCategories
                  .flatMap(cat => cat.goals)
                  .find(g => g.id === goalId);
                return (
                  <Badge key={goalId} variant="secondary" className="bg-fitness-primary/20 text-fitness-primary transition-all duration-200">
                    {goal?.title}
                  </Badge>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={saveGoals}
                className="fitness-gradient text-white px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Create My Personalized Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalSetting;
