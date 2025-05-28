
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, Food, Activity, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string;
  time: string;
}

const FoodLog = () => {
  const { toast } = useToast();
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'breakfast'
  });

  const [todaysFoods, setTodaysFoods] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Greek Yogurt with Berries',
      calories: 200,
      protein: 20,
      carbs: 25,
      fat: 5,
      meal: 'breakfast',
      time: '8:00 AM'
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 350,
      protein: 35,
      carbs: 15,
      fat: 12,
      meal: 'lunch',
      time: '12:30 PM'
    }
  ]);

  const dailyTargets = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 80
  };

  const currentTotals = todaysFoods.reduce((totals, food) => ({
    calories: totals.calories + food.calories,
    protein: totals.protein + food.protein,
    carbs: totals.carbs + food.carbs,
    fat: totals.fat + food.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const addFood = () => {
    if (!newFood.name || !newFood.calories) {
      toast({
        title: "Missing Information",
        description: "Please enter at least food name and calories.",
        variant: "destructive"
      });
      return;
    }

    const foodEntry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0,
      meal: newFood.meal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTodaysFoods([...todaysFoods, foodEntry]);
    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      meal: 'breakfast'
    });

    toast({
      title: "Food Added",
      description: `${foodEntry.name} has been logged successfully!`,
    });
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="fitness-gradient text-white border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Food className="h-6 w-6 mr-2" />
            Daily Food Log
          </CardTitle>
          <p className="text-white/90">Track your nutrition to fuel your fitness goals</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-fitness-primary" />
                Add Food Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foodName">Food Name</Label>
                  <Input
                    id="foodName"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    placeholder="e.g., Grilled Chicken Breast"
                    className="bg-white/70"
                  />
                </div>
                <div>
                  <Label htmlFor="meal">Meal</Label>
                  <select
                    id="meal"
                    value={newFood.meal}
                    onChange={(e) => setNewFood({...newFood, meal: e.target.value})}
                    className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-md"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                    placeholder="300"
                    className="bg-white/70"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                    placeholder="25"
                    className="bg-white/70"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                    placeholder="30"
                    className="bg-white/70"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
                    placeholder="10"
                    className="bg-white/70"
                  />
                </div>
              </div>
              <Button 
                onClick={addFood}
                className="w-full fitness-gradient text-white"
              >
                Add Food Entry
              </Button>
            </CardContent>
          </Card>

          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-fitness-secondary" />
                Today's Food Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysFoods.map((food) => (
                <div key={food.id} className="p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getMealIcon(food.meal)}</span>
                      <div>
                        <h4 className="font-semibold">{food.name}</h4>
                        <p className="text-sm text-muted-foreground">{food.meal} • {food.time}</p>
                      </div>
                    </div>
                    <Badge className="bg-fitness-primary/20 text-fitness-primary">
                      {food.calories} cal
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>Protein: {food.protein}g</div>
                    <div>Carbs: {food.carbs}g</div>
                    <div>Fat: {food.fat}g</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-fitness-primary" />
                Daily Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm">{currentTotals.calories} / {dailyTargets.calories}</span>
                </div>
                <Progress value={(currentTotals.calories / dailyTargets.calories) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm">{currentTotals.protein}g / {dailyTargets.protein}g</span>
                </div>
                <Progress value={(currentTotals.protein / dailyTargets.protein) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm">{currentTotals.carbs}g / {dailyTargets.carbs}g</span>
                </div>
                <Progress value={(currentTotals.carbs / dailyTargets.carbs) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm">{currentTotals.fat}g / {dailyTargets.fat}g</span>
                </div>
                <Progress value={(currentTotals.fat / dailyTargets.fat) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-fitness-secondary" />
                AI Nutrition Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white/50 rounded-lg">
                <Badge variant="secondary" className="mb-2">Protein Focus</Badge>
                <p className="text-sm">Great protein intake! You're on track to support muscle recovery and growth.</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <Badge variant="outline" className="mb-2">Suggestion</Badge>
                <p className="text-sm">Consider adding more complex carbs for sustained energy during workouts.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
