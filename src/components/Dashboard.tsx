
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, Dumbbell, Heart, Target } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<number>(3);
  const [healthScore, setHealthScore] = useState<number>(85);

  const stats = [
    { label: 'Days Active', value: '12', icon: Calendar, color: 'text-green-500' },
    { label: 'Workouts', value: workouts.toString(), icon: Dumbbell, color: 'text-green-500' },
    { label: 'Calories Burned', value: '2,450', icon: Activity, color: 'text-green-500' },
    { label: 'Health Score', value: healthScore.toString(), icon: Heart, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-black dark:text-white">
            <Target className="h-8 w-8 mr-3 mt-1 text-green-500" />
            Your Fitness Dashboard
          </CardTitle>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Track your progress and stay motivated</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-white border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                    <p className="text-4xl font-extrabold text-black mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Dumbbell className="h-6 w-6 mr-2 text-green-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-black">
                <span className="text-sm font-semibold">Strength Training</span>
                <span className="text-sm font-semibold">3/4 sessions</span>
              </div>
              <Progress value={75} className="h-3 bg-gray-200" />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-black">
                <span className="text-sm font-semibold">Cardio</span>
                <span className="text-sm font-semibold">2/3 sessions</span>
              </div>
              <Progress value={66} className="h-3 bg-gray-200" />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-black">
                <span className="text-sm font-semibold">Nutrition Goals</span>
                <span className="text-sm font-semibold">5/7 days</span>
              </div>
              <Progress value={71} className="h-3 bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Heart className="h-6 w-6 mr-2 text-green-500" />
              AI Coach Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Badge className="mb-2 bg-green-500 text-white">Today's Focus</Badge>
              <p className="text-black text-sm">Great job on yesterday's workout! Focus on upper body strength today and increase your protein intake.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Badge variant="outline" className="mb-2 border-green-500 text-green-600">Weekly Tip</Badge>
              <p className="text-black text-sm">Your consistency is improving! Consider adding 10 minutes of mobility work to enhance recovery.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
