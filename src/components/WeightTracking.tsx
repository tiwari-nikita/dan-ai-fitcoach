
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Weight, Calendar, Activity, Plus, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightTracking = () => {
  const { toast } = useToast();
  const { weightEntries, loading, addWeightEntry } = useWeightEntries();
  const [newEntry, setNewEntry] = useState({
    weight: '',
    notes: ''
  });

  const handleAddWeightEntry = async () => {
    if (!newEntry.weight) {
      toast({
        title: "Missing Weight",
        description: "Please enter your current weight.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addWeightEntry({
        weight: parseFloat(newEntry.weight),
        date: new Date().toISOString().split('T')[0],
        notes: newEntry.notes || null
      });

      setNewEntry({
        weight: '',
        notes: ''
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const chartData = weightEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight
  }));

  const currentWeight = weightEntries[0]?.weight || 0;
  const startWeight = weightEntries[weightEntries.length - 1]?.weight || 0;
  const weightChange = currentWeight - startWeight;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center text-white">Loading your weight tracking...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-white">
            <Weight className="h-8 w-8 mr-3 text-green-500" />
            Weight Tracking
          </CardTitle>
          <p className="text-gray-300 text-lg">Monitor your progress and body composition changes</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Activity className="h-6 w-6 mr-2 text-green-500" />
                Weight Progress Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          color: 'black'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        name="Weight (lbs)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-600">
                  No weight data available. Start by logging your first weight entry!
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Calendar className="h-6 w-6 mr-2 text-green-500" />
                Weight History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weightEntries.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No weight entries yet. Start tracking your progress!
                </p>
              ) : (
                weightEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-black">{entry.weight} lbs</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 italic">"{entry.notes}"</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Plus className="h-6 w-6 mr-2 text-green-500" />
                Log New Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight" className="text-black font-semibold">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  placeholder="175.0"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-black font-semibold">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="How are you feeling today?"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <Button 
                onClick={handleAddWeightEntry}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Log Weight
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Dumbbell className="h-6 w-6 mr-2 text-green-500" />
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weightEntries.length > 0 ? (
                <>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-green-500">
                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                    </div>
                    <p className="text-sm text-gray-600">Total Change</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-black">{startWeight}</div>
                      <p className="text-xs text-gray-600">Starting</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-black">{currentWeight}</div>
                      <p className="text-xs text-gray-600">Current</p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Badge className="mb-2 bg-green-500 text-white">AI Insight</Badge>
                    <p className="text-sm text-black">
                      {weightChange < 0
                        ? "Excellent progress! Your consistent effort is paying off."
                        : weightChange > 0
                        ? "You're building muscle mass! Consider tracking body fat % for better insights."
                        : "Maintaining your weight while building muscle. Great body recomposition!"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">Start logging your weight to see progress insights!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeightTracking;
