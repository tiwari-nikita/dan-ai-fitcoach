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
    { label: 'Days Active', value: '0', icon: Calendar, color: 'text-foreground' },
    { label: 'Workouts', value: workouts.toString(), icon: Dumbbell, color: 'text-foreground' },
    { label: 'Calories Burned', value: '0', icon: Activity, color: 'text-foreground' },
    { label: 'Health Score', value: healthScore.toString(), icon: Heart, color: 'text-foreground' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg"
              onClick={() => {
                if (stat.label === 'Workouts') {
                  window.location.href = '/workouts';
                } else if (stat.label === 'Health Score') {
                  calculateHealthScore(70, 1.75, 30); // Example values: weight (kg), height (m), age (years)
                } else {
                  
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-semibold">{stat.label}</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-lg rounded-lg transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Dumbbell className="h-5 w-5 mr-2 text-foreground" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-muted-foreground">
                <span className="text-sm">Strength Training</span>
                <span className="text-sm font-semibold">3/4 sessions</span>
              </div>
              <Progress value={75} className="h-2 bg-secondary" indicatorClassName="bg-gradient-to-r from-gradient-start to-gradient-end" />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-muted-foreground">
                <span className="text-sm">Cardio</span>
                <span className="text-sm font-semibold">2/3 sessions</span>
              </div>
              <Progress value={66} className="h-2 bg-secondary" indicatorClassName="bg-gradient-to-r from-gradient-start to-gradient-end" />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-muted-foreground">
                <span className="text-sm">Nutrition Goals</span>
                <span className="text-sm font-semibold">5/7 days</span>
              </div>
              <Progress value={71} className="h-2 bg-secondary" indicatorClassName="bg-gradient-to-r from-gradient-start to-gradient-end" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-lg rounded-lg transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Heart className="h-5 w-5 mr-2 text-foreground" />
              AI Coach Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-secondary rounded-lg border border-border transition-all duration-300 ease-in-out hover:bg-secondary/70">
              <Badge variant="default" className="mb-2 bg-gradient-to-r from-gradient-start to-gradient-end text-primary-foreground hover:opacity-90 transition-all duration-200">Today's Focus</Badge>
              <p className="text-muted-foreground text-xs sm:text-sm">Great job on yesterday's workout! Focus on upper body strength today and increase your protein intake.</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border transition-all duration-300 ease-in-out hover:bg-secondary/70">
              <Badge variant="outline" className="mb-2 border-foreground text-foreground hover:bg-secondary transition-all duration-200">Weekly Tip</Badge>
              <p className="text-muted-foreground text-xs sm:text-sm">Your consistency is improving! Consider adding 10 minutes of mobility work to enhance recovery.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
