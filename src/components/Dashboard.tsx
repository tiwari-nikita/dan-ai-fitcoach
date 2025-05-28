import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, Dumbbell, Heart } from 'lucide-react';

import { useState } from 'react';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<number>(0);
  const [healthScore, setHealthScore] = useState<number>(0);

  const addWorkout = () => {
    setWorkouts(workouts + 1);
  };

  const calculateHealthScore = (weight: number, height: number, age: number) => {
    // Basic health score calculation (replace with a more sophisticated formula)
    const score = weight / (height * height) * (100 - age);
    setHealthScore(Math.round(score));
  };

  const stats = [
    { label: 'Days Active', value: '0', icon: Calendar, color: 'text-fitness-primary' },
    { label: 'Workouts', value: workouts.toString(), icon: Dumbbell, color: 'text-fitness-secondary' },
    { label: 'Calories Burned', value: '0', icon: Activity, color: 'text-red-500' },
    { label: 'Health Score', value: healthScore.toString(), icon: Heart, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="fitness-card-gradient border-0 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                if (stat.label === 'Workouts') {
                  window.location.href = '/workouts';
                } else if (stat.label === 'Health Score') {
                  calculateHealthScore(70, 1.75, 30); // Example values: weight (kg), height (m), age (years)
                } else {
                  console.log(`Clicked ${stat.label}`);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fitness-card-gradient border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-fitness-primary" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Strength Training</span>
                <span className="text-sm font-semibold">3/4 sessions</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Cardio</span>
                <span className="text-sm font-semibold">2/3 sessions</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Nutrition Goals</span>
                <span className="text-sm font-semibold">5/7 days</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="fitness-card-gradient border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              AI Coach Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/50 rounded-lg">
              <Badge variant="secondary" className="mb-2">Today's Focus</Badge>
              <p className="text-sm">Great job on yesterday's workout! Focus on upper body strength today and increase your protein intake.</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <Badge variant="outline" className="mb-2">Weekly Tip</Badge>
              <p className="text-sm">Your consistency is improving! Consider adding 10 minutes of mobility work to enhance recovery.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
