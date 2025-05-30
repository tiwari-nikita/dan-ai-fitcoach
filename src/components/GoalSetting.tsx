
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Heart, Calendar, Activity, Weight, Target } from 'lucide-react';
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
    toast({
      title: "Goals Set Successfully!",
      description: `You've selected ${selectedGoals.length} goals. Dan Go AI will create a personalized plan for you.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-white">
            <Target className="h-8 w-8 mr-3 text-green-500" />
            Set Your Fitness Goals
          </CardTitle>
          <p className="text-gray-300 text-lg">Choose your primary goals so Dan Go AI can create the perfect plan for you</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goalCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="bg-white border-gray-300 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Icon className="h-6 w-6 mr-2 text-green-500" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGoals.includes(goal.id)
                        ? 'border-green-500 bg-green-100 shadow-md'
                        : 'border-gray-300 bg-white hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-black">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                      {selectedGoals.includes(goal.id) && (
                        <Badge className="bg-green-500 text-white">Selected</Badge>
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
        <Card className="bg-white border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Calendar className="h-6 w-6 mr-2 text-green-500" />
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
                  <Badge key={goalId} className="bg-green-500 text-white">
                    {goal?.title}
                  </Badge>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={saveGoals}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold shadow-lg"
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
