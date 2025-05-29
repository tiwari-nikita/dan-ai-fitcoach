import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, UtensilsCrossed, Activity, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFoodEntries } from '@/hooks/useFoodEntries';

const FoodLog = () => {
  const { toast } = useToast();
  const { foodEntries, loading, addFoodEntry } = useFoodEntries();
  const [newFood, setNewFood] = useState({
    food_description: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fats_g: '',
    meal_type: 'breakfast'
  });

  const dailyTargets = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 80
  };

  const todaysEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.date).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });

  const currentTotals = todaysEntries.reduce((totals, food) => ({
    calories: totals.calories + (food.calories || 0),
    protein: totals.protein + (food.protein_g || 0),
    carbs: totals.carbs + (food.carbs_g || 0),
    fat: totals.fat + (food.fats_g || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleAddFood = async () => {
    if (!newFood.food_description || !newFood.calories) {
      toast({
        title: "Missing Information",
        description: "Please enter at least food name and calories.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addFoodEntry({
        food_description: newFood.food_description,
        calories: parseInt(newFood.calories),
        protein_g: parseFloat(newFood.protein_g) || null,
        carbs_g: parseFloat(newFood.carbs_g) || null,
        fats_g: parseFloat(newFood.fats_g) || null,
        meal_type: newFood.meal_type,
        date: new Date().toISOString().split('T')[0]
      });

      setNewFood({
        food_description: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fats_g: '',
        meal_type: 'breakfast'
      });
    } catch (error) {
      // Error handled in hook
    }
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">Loading your food log...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="fitness-gradient text-white border-0 shadow-xl transition-all duration-300 ease-in-out">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <UtensilsCrossed className="h-6 w-6 mr-2" />
            Daily Food Log
          </CardTitle>
          <p className="text-white/90">Track your nutrition to fuel your fitness goals</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
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
                    value={newFood.food_description}
                    onChange={(e) => setNewFood({...newFood, food_description: e.target.value})}
                    placeholder="e.g., Grilled Chicken Breast"
                    className="bg-white/70 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="meal">Meal</Label>
                  <select
                    id="meal"
                    value={newFood.meal_type}
                    onChange={(e) => setNewFood({...newFood, meal_type: e.target.value})}
                    className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-md transition-all duration-200"
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
                    className="bg-white/70 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newFood.protein_g}
                    onChange={(e) => setNewFood({...newFood, protein_g: e.target.value})}
                    placeholder="25"
                    className="bg-white/70 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newFood.carbs_g}
                    onChange={(e) => setNewFood({...newFood, carbs_g: e.target.value})}
                    placeholder="30"
                    className="bg-white/70 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newFood.fats_g}
                    onChange={(e) => setNewFood({...newFood, fats_g: e.target.value})}
                    placeholder="10"
                    className="bg-white/70 transition-all duration-200"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddFood}
                className="w-full fitness-gradient text-white transition-colors duration-200 hover:opacity-90"
              >
                Add Food Entry
              </Button>
            </CardContent>
          </Card>

          <Card className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-fitness-secondary" />
                Today's Food Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEntries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No food entries for today. Start by adding your first meal!
                </p>
              ) : (
                todaysEntries.map((food) => (
                  <div key={food.id} className="p-4 bg-white/50 rounded-lg transition-all duration-200 hover:bg-white/70">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl sm:text-2xl mr-2">{getMealIcon(food.meal_type)}</span>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">{food.food_description}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {food.meal_type} • {new Date(food.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-fitness-primary/20 text-fitness-primary text-xs sm:text-sm">
                        {food.calories || 0} cal
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>Protein: {food.protein_g || 0}g</div>
                      <div>Carbs: {food.carbs_g || 0}g</div>
                      <div>Fat: {food.fats_g || 0}g</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
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

          <Card className="fitness-card-gradient border-0 shadow-lg transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-fitness-secondary" />
                AI Nutrition Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white/50 rounded-lg transition-all duration-200 hover:bg-white/70">
                <Badge variant="secondary" className="mb-2 transition-all duration-200">Protein Focus</Badge>
                <p className="text-xs sm:text-sm">Great protein intake! You're on track to support muscle recovery and growth.</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg transition-all duration-200 hover:bg-white/70">
                <Badge variant="outline" className="mb-2 transition-all duration-200">Suggestion</Badge>
                <p className="text-xs sm:text-sm">Consider adding more complex carbs for sustained energy during workouts.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
